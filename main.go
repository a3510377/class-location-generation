package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/a3510377/class-location-generation/version"
	"github.com/sirupsen/logrus"
	prefixed "github.com/x-cray/logrus-prefixed-formatter"
)

//go:embed templates/*
var templates embed.FS

//go:embed public/*
var webPublic embed.FS

var (
	flagVersion = flag.Bool("version", false, "show version")
	flagDebug   = flag.Bool("debug", false, "enable debug")
)

func main() {
	flag.Parse()

	if *flagVersion {
		fmt.Printf("version: %s %s\n", version.Release, version.GitHash)
		return
	}

	rootLogger := setupLogger()
	newLog := func(name string) *logrus.Entry {
		return rootLogger.WithField("prefix", name)
	}
	mainLog := newLog("main")
	mainLog.Info()

	staticFs := fs.FS(webPublic)
	htmlContent, err := fs.Sub(staticFs, "public")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.FS(htmlContent))

	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil); err != nil {
		log.Fatal(err)
	}
}

func setupLogger() *logrus.Logger {
	logger := &logrus.Logger{
		Out: os.Stdout,
		Formatter: &prefixed.TextFormatter{
			FullTimestamp: true,
		},
		Level: logrus.InfoLevel,
	}

	if *flagDebug || os.Getenv("DEBUG") == "1" {
		logger.Level = logrus.DebugLevel
	}

	return logger
}
