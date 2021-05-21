package main

import (
	"fmt"
	"math/rand"
	"os"
	"time"

	lorem "github.com/drhodes/golorem"
)

type learnerCareerOutcomes struct {
	icon    string
	pct     float32
	outcome string
}

type metadata struct {
	icon     string
	title    string
	subtitle string
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
			icon:    "careerDirectionSVG",
			pct:     generateRandomPercentage(),
			outcome: "started a new career after completing these courses",
		},
		learnerCareerOutcomes{
			icon:    "careerBenefitSVG",
			pct:     generateRandomPercentage(),
			outcome: "got a tangible career benefit from this course",
		},
		learnerCareerOutcomes{
			icon:    "careerPromotionSVG",
			pct:     generateRandomPercentage(),
			outcome: "got a pay increase or promotion",
		},
	}
}

func generateMetadata() []metadata {
	return []metadata{
		metadata{
			icon:     "sharableCertificateSVG",
			title:    "Shareable Certificate",
			subtitle: "Earn a Certificate upon completion",
		},
		metadata{
			icon:     "onlineSVG",
			title:    "100% online",
			subtitle: "Start instantly and learn at your own schedule",
		},
		metadata{
			icon:     "deadlinesSVG",
			title:    "Flexible Deadlines",
			subtitle: "Reset deadlines in accordance to your schedule",
		},
		metadata{
			icon:     "hoursSVG",
			title:    fmt.Sprintf("Approx. %d hours to complete", generateRandomHours()),
			subtitle: "",
		},
		metadata{
			icon:     "languagesSVG",
			title:    "English",
			subtitle: generateLanguages(),
		},
	}
}

func exitWithError(err error) {
	if err != nil {
		fmt.Printf("failed with error: %s", err)
		os.Exit(1)
	}
}

func main() {
	// currDir, err := os.Getwd()

	// exitWithError(err)

	// outputPath := filepath.Join(currDir, "seed.csv")

	recordsToGenerate := int(1e5)

	fmt.Printf("generating %d records\n", recordsToGenerate)

	// start timer
	start := time.Now()

	for i := 1; i <= recordsToGenerate; i++ {
		record := Record{
			courseID:              i,
			recentViews:           generateViews(),
			description:           lorem.Paragraph(1, 4),
			learnerCareerOutcomes: generateCareerOutcomes(),
			metadata:              generateMetadata(),
			whatYouWillLearn:      []string{},
			skillsYouWillGain:     []string{},
		}

		fmt.Printf("generating record %d with %d views\n", record.courseID, record.recentViews)
		fmt.Println(record.metadata)
		break
	}

	fmt.Printf("Generated %d records in %v\n", recordsToGenerate, time.Since(start))

	os.Exit(0)
}
