import 'package:flutter/material.dart';

import 'pages/Home.dart';

void main() {
  runApp(const HomePage());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return const HomePage();
  }
}
