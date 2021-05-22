package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/url"
	"os"
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
		outcomeJSON, err = json.Marshal(r.learnerCareerOutcomes)

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
		metadataJSON, err = json.Marshal(r.metadata)

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

func (r *Record) saveToDB(batch *pgx.Batch, ctx context.Context) error {

	outcomeArray, err := r.outcomeToPostgresArray()

	if err != nil {
		return err
	}

	metadataArray, err := r.metadataToPostgresArray()

	if err != nil {
		return err
	}

	batch.Queue(`insert into description
			(course_id,recent_views,description, learner_career_outcomes,
			metadata,what_you_will_learn,skills_you_will_gain)
			values($1, $2, $3, $4, $5, $6, $7)`, r.courseID, r.recentViews, r.description, outcomeArray,
		metadataArray, r.whatYouWillLearn, r.skillsYouWillGain)
	// _, err = conn.Exec(ctx, `
	// 		insert into description
	// 		(course_id,recent_views,description, learner_career_outcomes,
	// 		metadata,what_you_will_learn,skills_you_will_gain)
	// 		values($1, $2, $3, $4, $5, $6, $7)
	// 	`, r.courseID, r.recentViews, r.description, outcomeArray,
	// 	metadataArray, r.whatYouWillLearn, r.skillsYouWillGain)

	// fmt.Printf("inserted %d: %v\n", r.courseID, query.RowsAffected() == 1)

	return err
}

const tenMill = int(1e7)

func generateViews() int {
	return rand.Intn(tenMill) + tenMill
}

func generateRandomPercentage() float32 {
	return (rand.Float32() * 100) / 100
}

func generateRandomHours() int {
	return rand.Intn(200-20) + 200
}

func generateLanguages() string {
	return `
	"Arabic",
    "French",
    "Portuguese (European)",
    "Chinese (Simplified)",
    "Italian",
    "Vietnamese",
    "German",
    "Russian",
    "English",
    "Hebrew",
    "Spanish",
    "Hindi",
    "Japanese",
    "Turkish",
    "Gujarati",
    "Polish",
    "Persian",
    "Kannada",
    "Romanian",
	`
}

func generateCareerOutcomes() []learnerCareerOutcomes {
	return []learnerCareerOutcomes{
		learnerCareerOutcomes{
			Icon:    "careerDirectionSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "started a new career after completing these courses",
		},
		learnerCareerOutcomes{
			Icon:    "careerBenefitSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "got a tangible career benefit from this course",
		},
		learnerCareerOutcomes{
			Icon:    "careerPromotionSVG",
			PCT:     generateRandomPercentage(),
			Outcome: "got a pay increase or promotion",
		},
	}
}

func generateMetadata() []metadata {
	return []metadata{
		metadata{
			Icon:     "sharableCertificateSVG",
			Title:    "Shareable Certificate",
			Subtitle: "Earn a Certificate upon completion",
		},
		metadata{
			Icon:     "onlineSVG",
			Title:    "100% online",
			Subtitle: "Start instantly and learn at your own schedule",
		},
		metadata{
			Icon:     "deadlinesSVG",
			Title:    "Flexible Deadlines",
			Subtitle: "Reset deadlines in accordance to your schedule",
		},
		metadata{
			Icon:     "hoursSVG",
			Title:    fmt.Sprintf("Approx. %d hours to complete", generateRandomHours()),
			Subtitle: "",
		},
		metadata{
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

func exitWithError(err error) {
	if err != nil {
		fmt.Printf("failed with error: %s", err)
		os.Exit(1)
	}
}

func main() {
	// connect to db before generating
	conn, err := pgx.Connect(context.Background(), os.Getenv("PG_URL"))

	if err != nil {
		exitWithError(err)
	}

	recordsToGenerate := 108

	fmt.Printf("generating %d records\n", recordsToGenerate)

	_, err = conn.Exec(context.Background(), "begin")

	exitWithError(err)

	// start timer
	start := time.Now()

	defer func() {
		conn.Close(context.Background())

		fmt.Printf("Generated %d records in %v\n", recordsToGenerate, time.Since(start))

		os.Exit(0)
	}()

	j := 107997
	saveOnEvery := int(1e2)
	batchCount := math.Abs(float64((saveOnEvery - j)))

	batch := &pgx.Batch{}

	for i := j; i <= recordsToGenerate; i++ {
		record := Record{
			courseID:              i,
			recentViews:           generateViews(),
			description:           lorem.Paragraph(1, 4),
			learnerCareerOutcomes: generateCareerOutcomes(),
			metadata:              generateMetadata(),
			whatYouWillLearn:      generateWhatYouWillLearn(),
			skillsYouWillGain:     generateSkillsGained(),
		}

		fmt.Printf("generating record %d\n", record.courseID)

		if err = record.saveToDB(batch, context.Background()); err != nil {
			fmt.Printf("failed to save record %d: %v\n", record.courseID, err)
		}

		j++
		batchCount++

		// every 100k commit
		if j == saveOnEvery {
			fmt.Println("sending batch request")

			batchRequest := conn.SendBatch(context.Background(), batch)

			for ; batchCount > 0; batchCount-- {
				if query, err := batchRequest.Exec(); err != nil {
					fmt.Printf("batch failed: %v\n", err)
				} else {
					fmt.Printf("inserted %d: %v\n", record.courseID, query.RowsAffected() == 1)
				}
			}

			j = 0
			batchCount = 0
		}
	}

	if _, err := conn.Exec(context.Background(), "commit"); err != nil {
		fmt.Printf("commit failed: %v\n", err)
	}
}
