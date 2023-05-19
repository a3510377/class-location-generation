import 'dart:convert';
// ignore: avoid_web_libraries_in_flutter
import 'dart:html';

import 'storage.dart';

class LocalStorage extends BaseLocalStorage {
  LocalStorage(super.id);

  static Storage get localStorage => window.localStorage;

  @override
  bool exists() => localStorage.containsKey(id);

  @override
  Map<String, dynamic> readLocal() {
    try {
      return json.decode(
        localStorage.entries.firstWhere((e) => e.key == id).value,
      );
    } on StateError {
      return {};
    }
  }

  @override
  void writeLocal(Map<String, dynamic> nowData) {
    localStorage.update(
      id,
      (val) => json.encode(nowData),
      ifAbsent: () => json.encode(nowData),
    );
  }
}
