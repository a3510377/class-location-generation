package word

import (
	"archive/zip"
	"bufio"
	"bytes"
	"embed"
	"encoding/xml"
	"errors"
	"io"
	"os"
	"strings"
)

type Docx struct {
	content   string
	zipReader *zip.Reader
}

func ReadDocxFromTemplate(files embed.FS, path string) (docx *Docx, err error) {
	file, _ := files.Open(path)
	defer file.Close()
	data, _ := io.ReadAll(file)

	return ReadDocx(data)
}

func ReadDocx(data []byte) (docx *Docx, err error) {
	zipReader, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return
	}

	text, err := readText(zipReader.File)
	if err != nil {
		return
	}

	return &Docx{
		zipReader: zipReader,
		content:   text,
	}, nil
}

func readText(files []*zip.File) (string, error) {
	for _, file := range files {
		if file.Name == "word/document.xml" {
			documentReader, err := file.Open()
			if err != nil {
				return "", err
			}
			defer documentReader.Close()

			text, err := io.ReadAll(documentReader)
			if err != nil {
				return "", err
			}
			return string(text), nil
		}
	}

	return "", errors.New("document.xml file not found")
}

func (d *Docx) ReplaceText(old string, new string, num int) error {
	old, err := encode(old)
	if err != nil {
		return err
	}
	newString, err := encode(new)
	if err != nil {
		return err
	}
	d.content = strings.Replace(d.content, old, newString, num)

	return nil
}

func (d *Docx) Write(ioWriter io.Writer) error {
	zipWriter := zip.NewWriter(ioWriter)
	defer zipWriter.Close()

	for _, file := range d.zipReader.File {
		writer, err := zipWriter.Create(file.Name)
		if err != nil {
			return err
		}
		f, err := file.Open()
		if err != nil {
			return err
		}
		defer f.Close()

		if file.Name == "word/document.xml" {
			writer.Write([]byte(d.content))
			f, _ := os.Create("test.xml")
			f.Write([]byte(d.content))
			f.Close()
			continue
		}
		_, err = io.Copy(writer, f)
		if err != nil {
			return err
		}
	}
	return nil
}

func (d *Docx) Save(path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	return d.Write(f)
}

const NEWLINE = "</w:t><w:tab/><w:t>"

func encode(s string) (string, error) {
	var b bytes.Buffer
	enc := xml.NewEncoder(bufio.NewWriter(&b))
	if err := enc.Encode(s); err != nil {
		return s, err
	}

	result := strings.NewReplacer(
		"<string>", "",
		"</string>", "",
		"&#xD;&#xA;", NEWLINE, // \r\n
		"&#xD;", NEWLINE, // \r
		"&#xA;", NEWLINE, // \n
		"&#x9;", "<w:br/>", // \t (tab)
	).Replace(b.String())

	return result, nil
}
