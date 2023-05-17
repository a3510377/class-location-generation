import 'package:flutter/material.dart';

main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "test",
      home: const HomePage(),
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xfff3f4f5),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          background: const Color(0xfff3f4f5),
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<List<int?>> memberPos = [
    [-1, null, null, null, null, null, null],
    [1, 1, 1, 1, 1, 1, 1],
    [null, null, null, null, null, null, null],
    [1, null, null, null, null, null, null],
    [1, null, null, null, null, null, null],
  ];
  final Map<int, String> memberNames = {
    0: "Alice",
    1: "Bob",
    2: "Carol",
    3: "Dave",
    4: "Eve",
  };

  @override
  Widget build(BuildContext context) {
    List<TableRow> rows = [];
    for (final rowData in memberPos) {
      rows.add(TableRow(
        children: rowData.map((e) {
          if (e == -1) {
            return TableCell(
              verticalAlignment: TableCellVerticalAlignment.fill,
              child: CustomPaint(
                painter: DiagonalPainter(color: Colors.red),
                child: const SizedBox(width: 100, height: 100),
              ),
            );
          }

          return Center(
            child: Column(
              children: [
                Text(
                  memberNames[e] ?? "",
                  style: const TextStyle(decoration: TextDecoration.none),
                ),
                Text(
                  memberNames[e] ?? "",
                  style: const TextStyle(decoration: TextDecoration.none),
                )
              ],
            ),
          );
        }).toList(),
      ));
    }

    return Scaffold(
      body: Center(
        child: Expanded(
          child: Table(
            border: TableBorder.all(width: 2),
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            children: rows,
          ),
        ),
      ),
    );
  }
}

class DiagonalPainter extends CustomPainter {
  Color? color;

  DiagonalPainter({this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color ?? Colors.white
      ..strokeWidth = 2;

    canvas.drawLine(Offset.zero, Offset(size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
