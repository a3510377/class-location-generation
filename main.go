package main

import (
	"embed"
	"flag"
	"fmt"
	"os"

	"github.com/a3510377/class-location-generation/version"
	"github.com/sirupsen/logrus"
	prefixed "github.com/x-cray/logrus-prefixed-formatter"
)

//go:embed templates/*
var templates embed.FS

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
