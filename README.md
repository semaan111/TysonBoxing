# TYSON Boxing Club — Reel a pantalla completa con voz / Full-screen recording

Versión mobile first, bilingüe español/inglés, **música de Spotify solo en pantalla inicial y descansos**, entrenador de boxeo y grabación de cámara con la voz de las instrucciones integrada en el archivo final.

## Publicar en GitHub Pages

1. Descomprime el ZIP.
2. Entra en https://github.com/semaan111/TysonAppCol → **Add file → Upload files**.
3. Arrastra **todo el contenido descomprimido** a la raíz del repositorio, incluida **la carpeta `coach-audio`** (con cuatro MP3), además de `recorder.js`, `voice-bank.js`, `i18n.js`, `index.html` y `tyson-3d.png`.
4. **Commit changes**, espera el despliegue de GitHub Pages y abre https://semaan111.github.io/TysonAppCol/.
5. Si ves la versión antigua, fuerza la recarga (Ctrl + Shift + R en PC; en iPhone cierra y abre la pestaña).

La aplicación funciona completamente en GitHub Pages, sin backend, contraseñas ni base de datos.

## Grabar entrenamiento CON VOZ

1. En la pantalla inicial pulsa **Grabar entrenamiento + voz**.
2. Escoge **Cámara frontal** o **Trasera** y, opcionalmente, activa **Grabar sonido ambiente**. Este micrófono comienza desactivado para evitar capturar la voz dos veces o producir eco.
3. Pulsa **Grabar y entrenar** y **acepta el permiso de cámara**. La grabación empieza junto con el entrenamiento.
4. Escucharás las instrucciones y las combinaciones mientras boxeas; la voz del entrenador se mezcla digitalmente con la cámara para que quede **grabada dentro del archivo final**. Si no oyes la voz, toca **Activar voz** sobre la imagen mientras grabas.
5. Al finalizar el entrenamiento, la app prepara el video, muestra una vista previa y ofrece **Guardar video** y, cuando esté disponible, **Compartir / Guardar en Fotos**.
6. La app conserva temporalmente el video en memoria para volver a guardarlo mientras no cierres la pestaña. **Guárdalo antes de salir.** No se sube a ningún servidor.

## Voz, música y compatibilidad

- Para asegurar que la voz se incluya dentro del archivo, **cuando estás grabando se utilizan clips de voz sintéticos integrados en la app** (un entrenador provisional, **no una imitación de Mike Tyson**). Puedes sustituirlos más adelante por una voz original de mejor calidad, manteniendo el sistema de grabación.
- Cuando no grabas, continúa la voz elegida en el sistema de tu dispositivo.
- Las indicaciones se graban tanto en **Español** como en **English**, según el idioma que hayas elegido antes de comenzar.
- La música de Spotify **suena solo al principio y durante los descansos**, si Spotify lo permite, pero **NO forma parte del archivo de video**. La música de Spotify usa un iframe externo y el reproductor no expone el audio a la pista de MediaRecorder.
- Las sesiones siguen pausándose al minimizar o cambiar de pestaña. Mantén la app abierta.
- El navegador puede guardar en WebM (típico en Chrome) o MP4 (típico en Safari). Se escoge dinámicamente según soporte. Los permisos de cámara/micrófono necesitan **HTTPS**, proporcionado automáticamente por GitHub Pages.
- La grabación de cámara y audio **depende de MediaRecorder, Web Audio y del hardware del navegador**. La reproducción real en iPhone Safari debe probarse en tu dispositivo; algunos modelos/versiones pueden no admitir la mezcla de pistas. Se muestra un mensaje cuando el navegador no ofrece compatibilidad.
- Si activas el micrófono para grabar sonido ambiente, usa preferiblemente un micrófono o auriculares apropiados para evitar eco. Si está desactivado, el video tendrá la voz del entrenador pero no grabará los sonidos del lugar.
- **No se hace análisis técnico del boxeo por IA** ni seguimiento corporal: solo captura de video y audio.

## Pruebas

`npm test` ejecuta las pruebas de biblioteca de golpes, reloj, bilingüismo, Spotify y bancos de audio. Se verificó además en Chromium simulado un video final WebM con pistas de **video VP8** y **audio Opus** que contiene voz, pero la cámara de iPhone real queda pendiente de comprobación.

Este proyecto independiente no está afiliado a Mike Tyson ni Spotify y no utiliza su voz real.

## Actualización: grabación tipo reel (octubre 2026)

- **Detener video**: ahora funciona sin confirmación, deja de grabar inmediatamente, pausa el entrenamiento y abre la pantalla de revisión.
- El preview en pantalla completa usa exactamente el mismo canvas que el video guardado. Las combinaciones y el cronómetro se dibujan dentro del archivo de video.
- Se quitaron las dos capas oscuras sobre la cámara. Los textos se distinguen mediante sombra discreta.
- Se separaron las tarjetas Ajustar y Grabar; se eliminaron las flechas decorativas y el icono de candado.
- Audio: se reanuda el motor Web Audio después de activar la cámara; mientras se graba existe el botón **Activar voz** para recuperarlo si Safari lo suspende. Prueba con el volumen multimedia alto y el celular desbloqueado.
- Si el audio de la grabación sigue fallando en algún iPhone, prueba Safari actualizado y comparte el modelo e iOS: el hardware del navegador puede limitar la mezcla de cámara y Web Audio.
- El botón Detener y Activar voz son controles de la aplicación, no quedan superpuestos en el video exportado.


## Actualización: escuchar al entrenador mientras grabas

La voz debe sonar **en el celular durante el entrenamiento** y también quedar integrada en el video guardado. Esta versión separa las dos rutas:

- **En iPhone/Safari:** reproduce las frases mediante un reproductor de audio HTML separado mientras Web Audio sigue mezclando esas mismas frases en el archivo grabado. También solicita el modo de sesión de audio `playback` (o `play-and-record` si activas el micrófono ambiente), cuando el navegador lo permite.
- **En otros navegadores:** mantiene la voz por Web Audio conectada al altavoz y al video.
- **Mientras grabas:** el botón superior **Probar voz / Test coach** puede activar la salida del iPhone mediante una pulsación directa, sin interrumpir el programa ni dejar de anunciar combinaciones. Si aparece **Toca para oír la voz**, púlsalo.
- **Recomendación para iPhone:** prueba con el volumen multimedia alto, el altavoz del teléfono o auriculares, y desactiva **Grabar sonido ambiente** si no lo necesitas. Si el iPhone mantiene el audio silenciado, toca **Probar voz** sobre la grabación.

La activación de audio puede variar en versiones de iOS y Safari; la salida real por los altavoces de un iPhone debe comprobarse en ese dispositivo. El hecho de que el archivo grabado contenga audio no confirma que Safari lo haya enviado al altavoz.
