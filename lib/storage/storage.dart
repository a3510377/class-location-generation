export ''
    if (dart.library.io) 'storage_io.dart'
    if (dart.library.html) 'storage_html.dart';

abstract class BaseLocalStorage {
  final String id;
  Map<String, dynamic> _data;
  Map<String, dynamic>? initData;

  BaseLocalStorage(this.id) : _data = {};

  void init([Map<String, dynamic>? initialData]) {
    initData = initialData;
    _data = initialData ?? {};

    exists() ? read() : write();
  }

  T get<T>(String key) {
    read();
    return _data[key];
  }

  void clear() {
    _data = {};
    write();
  }

  void set(String key, dynamic value) {
    _data[key] = value;
    write();
  }

  void remove(String key) {
    _data.remove(key);
    write();
  }

  void write({bool init = false}) {
    if (init) _data = initData ?? {};

    writeLocal(_data);
  }

  void read() {
    if (!exists()) write();

    _data = readLocal();
  }

  Map<String, dynamic> get data => _data;

  bool exists();
  void writeLocal(Map<String, dynamic> nowData);
  Map<String, dynamic> readLocal();
}
