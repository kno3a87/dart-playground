import 'package:dart_eval/dart_eval.dart';
import 'dart:js_interop';

extension type JSTextArea._(JSObject _) implements JSObject {
  @JS()
  external String get value;
  external JSTextArea();
}

@JS('document.getElementById')
external JSTextArea? getElementById(String id);

extension type Event._(JSObject _) implements JSObject {
  @JS()
  external JSObject get data;
  external Event();
}

@JS('window.addEventListener')
external void addEventListener(
  String type,
  JSFunction listner, [
  JSAny options,
]);

void main() {
  var element = getElementById('input');
  if (element == null) {
    print('Element not found');
    return;
  }

  // index.html から postMessage で受け取った値を評価する
  addEventListener(
    'message',
    (Event event) {
      try {
        // メッセージデータを取得
        final messageData = event.data;
        // 受け取ったデータを string として解釈し，eval で評価し実行する
        eval(messageData.toString());
      } catch (e) {
        // エラーがあればエラーを出力
        print(e);
      }
    }.toJS,
  );
}
