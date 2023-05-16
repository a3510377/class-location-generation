import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int selectedIndex = 0;
  late PageController _pageController;

  static const List<Widget> pages = [
    TestPage(),
    TestPage2(),
  ];
  static const List<NavigationRailDestination> navItems = [
    NavigationRailDestination(
      icon: Icon(Icons.shuffle),
      selectedIcon: Icon(Icons.shuffle_rounded),
      label: Text("隨機生成"),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.settings),
      selectedIcon: Icon(Icons.settings_rounded),
      label: Text("選擇模板"),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: selectedIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: Builder(
        builder: (context) => Row(
          children: [
            NavigationRail(
              selectedIndex: selectedIndex,
              minWidth: 65,
              groupAlignment: Alignment.center.x,
              labelType: NavigationRailLabelType.selected,
              onDestinationSelected: (index) {
                setState(() {
                  _pageController.animateToPage(
                    index,
                    duration: const Duration(milliseconds: 10),
                    curve: Curves.easeInOut,
                  );
                });
              },
              destinations: navItems,
              backgroundColor: Theme.of(context).colorScheme.inversePrimary,
            ),
            const VerticalDivider(thickness: 1, width: 1),
            Expanded(
              child: PageView(
                scrollDirection: Axis.vertical,
                controller: _pageController,
                onPageChanged: (index) => setState(() => selectedIndex = index),
                padEnds: false,
                children: pages,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TestPage extends StatefulWidget {
  const TestPage({super.key});

  @override
  State<TestPage> createState() => _TestPage();
}

class _TestPage extends State<TestPage> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text("Test"),
      ),
    );
  }
}

class TestPage2 extends StatefulWidget {
  const TestPage2({super.key});

  @override
  State<TestPage2> createState() => _TestPage2();
}

class _TestPage2 extends State<TestPage2> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text("Test2"),
      ),
    );
  }
}
