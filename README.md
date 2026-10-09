# TYSON Boxing Club · Bilingüe + video + YouTube

Lista para publicar en GitHub Pages. Subir TODOS los archivos que están dentro de esta carpeta al repositorio, conservando `coach-audio/`.

## Cambios
- La misma voz grabada en español o inglés se utiliza tanto para entrenar sin cámara como durante la grabación. Ya no se usa speechSynthesis en el entrenamiento. **Es una voz provisional**: puede sonar sintética; una voz más natural requiere nuevos audios originales.
- Botón **← Inicio** para volver al menú de bienvenida. Mientras se graba, se detiene el video y se abre la pantalla para guardarlo primero.
- Reproductor oficial de YouTube: video `OXavSAGH8P8` (es un video/mix, no un identificador de playlist); botón de pausa/reproducción y control 0–35% (18% inicialmente). Cuando habla el entrenador baja a ~45% del valor seleccionado y vuelve después. La música se solicita durante todas las fases.
- Reproductor fijo **visible de 200x200**, conforme a las condiciones oficiales de YouTube. No se puede ocultar el video y continuar utilizándolo como audio de fondo mediante la integración oficial.
- La música de YouTube NO forma parte del MP4/WebM grabado, que incluye únicamente los audios de instrucciones y opcionalmente el micrófono.

## Límites
- YouTube puede exigir tocar Play; podría impedir la reproducción integrada de este video si su propietario la restringe. El navegador también puede suspender reproducción al bloquear el celular.
- iOS Safari puede interferir con la reproducción simultánea de YouTube, cámara y la voz del entrenador. Debe comprobarse en un iPhone real. Es una limitación de la plataforma, no un fallo que pueda garantizarse corregido por JS.
- Los archivos MP3 de `coach-audio` son la **voz compartida** entre ambos modos; no se reproduce exactamente la antigua voz de sistema. La voz no representa a Mike Tyson.
- El reproductor oficial ocupa 200x200 px en la pantalla, incluso en el modo de cámara, y no aparece dentro del video exportado.

## Publicación
1. Descomprime `TYSON_YouTube_Misma_Voz_GitHub.zip`.
2. En tu repositorio GitHub, sube el contenido completo de la carpeta `TYSON` (archivos en la raíz).
3. Conserva `.nojekyll` y `coach-audio/*.mp3`.
4. GitHub Pages: rama `main` y `/(root)`.
5. Reabre con Ctrl+Shift+R y realiza una sesión de prueba de 15 segundos.
