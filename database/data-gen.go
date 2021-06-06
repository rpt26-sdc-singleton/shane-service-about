package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"math/rand"
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
	outcomesStr           []string // postgres friendly text array
	metadataStr           []string // postgres friendly text array
	whatYouWillLearn      []string
	skillsYouWillGain     []string
}

func (r *Record) outcomeToPostgresArray() error {
	output := []string{}

	str := "{"

	var outcomeJSON []byte
	var err error

	outcomeLen := len(r.learnerCareerOutcomes)

	for i := 0; i < outcomeLen; i++ {
		outcomeJSON, err = json.Marshal(r.learnerCareerOutcomes[i])

		if err != nil {
			return err
		}

		output = append(output, string(outcomeJSON))

		// str += "\""

		// str += url.QueryEscape(string(outcomeJSON))

		// str += "\""

		// if i != (outcomeLen - 1) {
		// 	str += ","
		// }
	}

	str += "}"

	r.outcomesStr = output

	return nil
}

func (r *Record) metadataToPostgresArray() error {
	output := []string{}

	str := "{"

	var metadataJSON []byte
	var err error

	metadataLen := len(r.metadata)

	for i := 0; i < metadataLen; i++ {
		metadataJSON, err = json.Marshal(r.metadata[i])

		if err != nil {
			return err
		}

		output = append(output, string(metadataJSON))

		// str += "\""

		// str += url.QueryEscape(string(metadataJSON))

		// str += "\""

		// if i != (metadataLen - 1) {
		// 	str += ","
		// }
	}

	str += "}"

	r.metadataStr = output

	return nil
}

func newRecord(id int) Record {
	return Record{
		courseID:              id,
		recentViews:           generateViews(),
		description:           lorem.Paragraph(10, 14),
		learnerCareerOutcomes: generateCareerOutcomes(),
		metadata:              generateMetadata(),
		whatYouWillLearn:      generateWhatYouWillLearn(),
		skillsYouWillGain:     generateSkillsGained(),
	}
}

type databasePipe struct {
	conn    *pgx.Conn
	ctx     context.Context
	records []*Record
}

func (pipe *databasePipe) addToQueue(record *Record) error {
	if err := record.outcomeToPostgresArray(); err != nil {
		fmt.Printf("learner outcomes conversion failed: %v\n", err)

		os.Exit(1)
	}

	if err := record.metadataToPostgresArray(); err != nil {
		return err
	}

	pipe.records = append(pipe.records, record)

	return nil
}

func (pipe *databasePipe) send() error {
	_, err := pipe.conn.CopyFrom(
		pipe.ctx,
		pgx.Identifier{"description"},
		[]string{
			"recent_views",
			"description",
			"learner_career_outcomes",
			"metadata",
			"what_you_will_learn",
			"skills_you_will_gain",
		},
		pgx.CopyFromSlice(len(pipe.records), func(i int) ([]interface{}, error) {
			record := pipe.records[i]

			return []interface{}{
				record.recentViews,
				record.description,
				record.outcomesStr,
				record.metadataStr,
				record.whatYouWillLearn,
				record.skillsYouWillGain,
			}, nil
		}),
	)

	return err
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

func generateRecords(pipe chan databasePipe, runner databasePipe, wg *sync.WaitGroup) {
	batchCount := 0

	for i := startAtI; i <= recordsToGenerate; i++ {
		record := newRecord(i)

		fmt.Printf("generating record number %d\n", i)

		if err := runner.addToQueue(&record); err != nil {
			fmt.Printf("failed to add record %d to queue: %v\n", record.courseID, err)

			continue
		}

		batchCount++

		// every n generated
		if batchCount == saveOnEvery || (i == recordsToGenerate) {
			fmt.Println("sending batch request")
			pipe <- runner
			batchCount = 0
		}
	}

	close(pipe)
	wg.Done()
}

func startBatchRunner(pipe chan databasePipe, wg *sync.WaitGroup) {
	for p := range pipe {
		if err := p.send(); err != nil {
			fmt.Printf("failed to send to database: %v\n", err)
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

	pipe := make(chan databasePipe, 1)
	runner := databasePipe{
		conn:    conn,
		records: make([]*Record, 0),
		ctx:     context.Background(),
	}

	wg.Add(1)

	go generateRecords(pipe, runner, &wg)

	wg.Add(1)

	// listen for generated records
	go startBatchRunner(pipe, &wg)

	wg.Wait()
}
