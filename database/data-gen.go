package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"math/rand"
	"net/url"
	"os"
	"sync"
	"time"

	lorem "github.com/drhodes/golorem"
	pgx "github.com/jackc/pgx/v4"
)

type learnerCareerOutcomes struct {
	Icon    string  `json:"icon"`
	PCT     float32 `json:"pct"`
	Outcome string  `json:"outcome"`
}

type metadata struct {
	Icon     string `json:"icon"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
}

type Record struct {
	courseID              int
	recentViews           int
	description           string
	learnerCareerOutcomes []learnerCareerOutcomes
	metadata              []metadata
	whatYouWillLearn      []string
	skillsYouWillGain     []string
}

func (r *Record) outcomeToPostgresArray() (string, error) {
	str := "{"

	var outcomeJSON []byte
	var err error

	outcomeLen := len(r.learnerCareerOutcomes)

	for i := 0; i < outcomeLen; i++ {
		outcomeJSON, err = json.Marshal(r.learnerCareerOutcomes[i])

		if err != nil {
			return "", err
		}

		str += "\""

		str += url.QueryEscape(string(outcomeJSON))

		str += "\""

		if i != (outcomeLen - 1) {
			str += ","
		}
	}

	str += "}"

	return str, nil
}

func (r *Record) metadataToPostgresArray() (string, error) {
	str := "{"

	var metadataJSON []byte
	var err error

	metadataLen := len(r.metadata)

	for i := 0; i < metadataLen; i++ {
		metadataJSON, err = json.Marshal(r.metadata[i])

		if err != nil {
			return "", err
		}

		str += "\""

		str += url.QueryEscape(string(metadataJSON))

		str += "\""

		if i != (metadataLen - 1) {
			str += ","
		}
	}

	str += "}"

	return str, nil
}

func newRecord(id int) Record {
	return Record{
		courseID:              id,
		recentViews:           generateViews(),
		description:           lorem.Paragraph(1, 4),
		learnerCareerOutcomes: generateCareerOutcomes(),
		metadata:              generateMetadata(),
		whatYouWillLearn:      generateWhatYouWillLearn(),
		skillsYouWillGain:     generateSkillsGained(),
	}
}

type batchRequest struct {
	conn  *pgx.Conn
	batch *pgx.Batch
	ctx   context.Context
}

func (b *batchRequest) addToQueue(record Record) error {
	outcomeArray, err := record.outcomeToPostgresArray()

	if err != nil {
		return err
	}

	metadataArray, err := record.metadataToPostgresArray()

	if err != nil {
		return err
	}

	b.batch.Queue(`insert into description
			(course_id,recent_views,description, learner_career_outcomes,
			metadata,what_you_will_learn,skills_you_will_gain)
			values($1, $2, $3, $4, $5, $6, $7)`, record.courseID, record.recentViews, record.description, outcomeArray,
		metadataArray, record.whatYouWillLearn, record.skillsYouWillGain)

	return err
}

func (b *batchRequest) send() error {
	batchResults := b.conn.SendBatch(b.ctx, b.batch)

	if _, err := batchResults.Exec(); err != nil {
		return fmt.Errorf("batch failed: %v", err)
	} else {
		b.batch = &pgx.Batch{}
	}

	return batchResults.Close()
}

func generateViews() int {
	const tenMill = int(1e7)
	return rand.Intn(tenMill) + tenMill
}

func generateRandomPercentage() float32 {
	return (rand.Float32() * 100) / 100
}

func generateRandomHours() int {
	return rand.Intn(200-20) + 200
}

func generateLanguages() string {
	languages := "Arabic, French, Portuguese (European), Chinese (Simplified),"
	languages += "Italian, Vietnamese, German, Russian, English, Hebrew, Spanish,"
	languages += "Hindi, Japanese, Turkish, Gujarati, Polish, Persian, Kannada, Romanian"

	return languages
}

func generateCareerOutcomes() []learnerCareerOutcomes {
	return []learnerCareerOutcomes{
		{
			Icon:    "careerDirectionSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "started a new career after completing these courses",
		},
		{
			Icon:    "careerBenefitSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "got a tangible career benefit from this course",
		},
		{
			Icon:    "careerPromotionSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "got a pay increase or promotion",
		},
	}
}

func generateMetadata() []metadata {
	return []metadata{
		{
			Icon:     "sharableCertificateSVG",
			Title:    "Shareable Certificate",
			Subtitle: "Earn a Certificate upon completion",
		},

		{
			Icon:     "onlineSVG",
			Title:    "100% online",
			Subtitle: "Start instantly and learn at your own schedule",
		},

		{
			Icon:     "deadlinesSVG",
			Title:    "Flexible Deadlines",
			Subtitle: "Reset deadlines in accordance to your schedule",
		},

		{
			Icon:     "hoursSVG",
			Title:    fmt.Sprintf("Approx. %d hours to complete", generateRandomHours()),
			Subtitle: "",
		},

		{
			Icon:     "languagesSVG",
			Title:    "English",
			Subtitle: generateLanguages(),
		},
	}
}

func generateWhatYouWillLearn() []string {
	return []string{
		lorem.Paragraph(2, 2),
		lorem.Paragraph(2, 2),
		lorem.Paragraph(2, 2),
		lorem.Paragraph(2, 2),
	}
}

func generateSkillsGained() []string {
	n := rand.Intn(10-1) + 10

	skills := make([]string, n)

	for i := 0; i < len(skills); i++ {
		skills[i] = lorem.Sentence(2, 3)
	}

	return skills
}

func generateRecords(batchChan chan batchRequest, batchReq batchRequest, wg *sync.WaitGroup) {
	batchCount := 0

	for i := startAtI; i <= recordsToGenerate; i++ {
		record := newRecord(i)

		fmt.Printf("generating record %d\n", record.courseID)

		err := batchReq.addToQueue(record)

		if err != nil {
			fmt.Printf("failed to save record %d: %v\n", record.courseID, err)
			continue
		}

		batchCount++

		// every n generated
		if batchCount == saveOnEvery || (i == recordsToGenerate) {
			fmt.Println("sending batch request")
			batchChan <- batchReq
			batchReq.batch = &pgx.Batch{}
			batchCount = 0
		}
	}

	close(batchChan)
	// done <- true
	wg.Done()

}

func startBatchRunner(batchChan chan batchRequest, wg *sync.WaitGroup) {
	for br := range batchChan {
		if err := br.send(); err != nil {
			fmt.Printf("failed to send batch: %v\n", err)
		}
	}

	wg.Done()
}

func exitWithError(err error) {
	if err != nil {
		fmt.Printf("failed with error: %s", err)
		os.Exit(1)
	}
}

var startAtI int
var recordsToGenerate int
var saveOnEvery int

func init() {
	flag.IntVar(&startAtI, "start", 1, "start at record i")
	flag.IntVar(&recordsToGenerate, "end", int(1e7), "end with record i")
	flag.IntVar(&saveOnEvery, "saveOnEvery", int(75e3), "save after n records generated")
	flag.Parse()
}

func main() {
	// connect to db before generating
	conn, err := pgx.Connect(context.Background(), os.Getenv("PG_URL"))

	if err != nil {
		exitWithError(err)
	}

	fmt.Printf("generating %d records\n", recordsToGenerate)

	start := time.Now()

	defer func(start time.Time) {
		if err := conn.Close(context.Background()); err != nil {
			fmt.Printf("failed to close database connection: %v\n", err)
		}

		fmt.Printf("Generated %d records in %v\n", recordsToGenerate, time.Since(start))

		os.Exit(0)
	}(start)

	wg := sync.WaitGroup{}

	batchChan := make(chan batchRequest, 1)
	batchReq := batchRequest{
		conn:  conn,
		batch: &pgx.Batch{},
		ctx:   context.Background(),
	}

	wg.Add(1)

	go generateRecords(batchChan, batchReq, &wg)

	wg.Add(1)

	// listen for generated records
	go startBatchRunner(batchChan, &wg)

	wg.Wait()
}
