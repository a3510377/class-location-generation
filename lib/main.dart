import 'package:flutter/material.dart';

import 'pages/main_page.dart';

main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "test",
      home: const TableExampleApp(),
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
    );
  }
}

class TableExampleApp extends StatelessWidget {
  const TableExampleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: "test",
      home: TableExample(),
    );
  }
}

class TableExample extends StatelessWidget {
  const TableExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Table(
      border: TableBorder.all(),
      columnWidths: const <int, TableColumnWidth>{
        0: FixedColumnWidth(50),
        1: FlexColumnWidth(),
        2: FlexColumnWidth(),
        3: FlexColumnWidth(),
        4: FlexColumnWidth(),
        5: FlexColumnWidth(),
        6: FlexColumnWidth(),
      },
      children: [
        const TableRow(
          children: [
            Text("1"),
            Text("2"),
            Text("3"),
            Text("4"),
            Text("5"),
            Text("6"),
            Text("7")
          ],
        ),
        TableRow(
          children: [
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
            Container(height: 32, color: Colors.yellow),
          ],
        ),
      ],
    );
  }
}
