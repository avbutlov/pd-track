import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"

Font.register({
  family: "Roboto",
  fonts: [
    { src: "fonts/Roboto-Regular.ttf" },
    { src: "fonts/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Roboto", fontSize: 11, color: "#1a1a1a" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  section: { marginBottom: 8 },
  heading: { fontSize: 13, fontWeight: "bold", marginBottom: 4, marginTop: 10 },
  bullet: { marginLeft: 12, marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { lineHeight: 1.6 },
  meta: { fontSize: 9, color: "#888", marginBottom: 16 },
})

function renderMarkdown(content: string) {
  const lines = content.split("\n")
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <Text key={i} style={styles.heading}>
          {line.replace("## ", "")}
        </Text>
      )
    }
    if (line.startsWith("- ")) {
      return (
        <Text key={i} style={styles.bullet}>
          • {line.replace("- ", "")}
        </Text>
      )
    }
    if (line.trim() === "") {
      return <Text key={i}>{"\n"}</Text>
    }

    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <Text key={i} style={styles.text}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <Text key={j} style={styles.bold}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    )
  })
}

export function ReportPdfDocument({
  title,
  content,
  startDate,
  endDate,
}: {
  title: string
  content: string
  startDate: string
  endDate: string
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {new Date(startDate).toLocaleDateString()} —{" "}
          {new Date(endDate).toLocaleDateString()}
        </Text>
        <View style={styles.section}>{renderMarkdown(content)}</View>
      </Page>
    </Document>
  )
}
