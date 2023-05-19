import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'storage.dart';

class LocalStorage extends BaseLocalStorage {
  final String? path;
  final String fileName;
  RandomAccessFile? _file;

  LocalStorage(super.id, {fileName, path})
      : fileName = fileName ?? "class-location.json",
        path = path ?? ".";

  @override
  bool exists() {
    final file = File("$path/$fileName");
    if (!file.existsSync()) return false;

    _file ??= file.openSync(mode: FileMode.append);

    return _file!.lengthSync() > 0;
  }

  @override
  Map<String, dynamic> readLocal() {
    if (!exists()) init(initData);

    _file!.setPositionSync(0);
    final buffer = Uint8List(_file!.lengthSync());
    _file!.readIntoSync(buffer);

    return json.decode(utf8.decode(buffer));
  }

  @override
  void writeLocal(Map<String, dynamic> nowData) {
    if (!exists()) init(initData);

    _file!.lockSync();
    _file!.setPositionSync(0);
    _file!.writeFromSync(utf8.encode(json.encode(nowData)));
    _file!.unlockSync();
  }
}
