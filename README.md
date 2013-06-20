## Summary ##

Here are the links to the [wiki pages](https://github.com/dahuapp/Dahu/wiki/_pages).

You may view a presentation of the Dahu project by cloning the Dahu.git repository
and opening the dahuproject.html file in the presentation sub-repository.

The objective of this project is to develop a "real" alternative to existing screencasting software. Even if there is a wide variety of software that offers to make screencasts, none of these programs do offer effective solutions combining the features / properties that we could expect of this kind of tool. 

Generally the approach is to make a video recording of an area of ​​your screen and to couple the audio. This approach sets several problems for the capture (an error in your manipulation or speech implies restarting everything or do some video collage), post-editing (adding text, animations, and other, means video editing), export (the formats are owner, and often too heavy), indexing (very difficult to index a video or a Flash file), reading (not practical to have to move the cursor to find the piece of information we are looking for: the time or this or that thing is explained), aso..

An interesting approach is to use animations simpler as videos  (succession of fixed screens with a few additions such as moving the mouse capture, tooltips, ...), which can render close to the video, but simplifying and improving the capture and visualization. Solutions like [wink](http://www.debugmode.com/wink/), [Adobe Captivate](http://www.adobe.com/uk/products/captivate.html), [salasaga](http://sourceforge.net/projects/salasaga/), also offer interesting features in this direction but does not include the following criteria:

* Open source : no effective solution is available as free software,
* Multi platform: no free solution is effective and free multi-platform,
* Open standard: no effective solution uses open standards for export, import and visualization of screencasts. The formats used are often Flash or video formats.
* Multi export: no effective solution offers to use an intermediate format to handle screencasts, for example, offer several export / playback format of these screencasts.
* Indexable: Because of export formats selected by existing solutions, it is impossible to index the screencasts generated(useful for search engines but also to improve the presentation of these screencasts).
* Ergonomic: existing solutions are often not very ergonomic whether for recording screencasts or for reading, for instance, it is necessary to use the scroll bar of the Flash player or video to search / access a particular portion of the screencast.
* Web friendly: despite the fact that screencasts are designed for e-learning, none of the solutions are properly integrated with web technologies (HTML5, CSS, JS).

The developed solution will consist in three parts:
* Capture: a tool for capturing and editing, written in JavaFX and Java. It will allow : a) the recording of information linked to the screencasts and b) post-editing screencasts to add meta-data (eg, texts, animations and information about screencasts.
* Intermediate Format: an intermediate format to store the content, form and dynamics of screencasts. This format must be defined on open standards (XML, JSON, other), be extensible, and portable.
* Reading: a reader to view screencasts in a web browser (HTML5, JS, CSS).

