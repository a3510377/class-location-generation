package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/a3510377/class-location-generation/version"
	"github.com/sirupsen/logrus"
	prefixed "github.com/x-cray/logrus-prefixed-formatter"
)

//go:embed templates/*
var templates embed.FS

//go:embed web
var webFile embed.FS

var (
	flagVersion = flag.Bool("version", false, "show version")
	flagDebug   = flag.Bool("debug", false, "enable debug")
)

const webStaticPath = "static"

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

	webFileFS := fs.FS(webFile)
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache")

		fmt.Println(r.URL.Path)
		if r.URL.Path == "/" {
			r.URL.Path = fmt.Sprintf("/%s/", webStaticPath)
		} else {
			b := strings.Split(r.URL.Path, "/")[0]
			if b != webStaticPath {
			}
		}
		http.FileServer(http.FS(webFileFS)).ServeHTTP(w, r)
	}))

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
