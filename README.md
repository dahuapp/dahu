## Summary ##

The objective of this project is to develop a "real" alternative to existing screencasting software. Even if there is a wide variety of software offering making screencasts, none of these programs do not offer effective solutions combining the features / properties expected of this kind of tool. 

Generally the proposed approach is to make a video recording of an area of ​​your screen and to couple the audio. This approach poses several problems for the capture (an error in your manipulation or speech and we must take all or do video collage), post-editing (add text, animations, and other, return to the video editing), export (the formats are proprietary, and often too heavy), indexing (very difficult to index a video or Flash file), reading (not practical to have to move the cursor to find information we are looking for: the time or this or that thing is explained), etc..

An interesting approach is to use simple as video animations (succession of fixed screen with a few additions such as moving the mouse capture, tooltips, ...), which can render close to the video, but simplifying and improving the capture and visualization. Solutions like [http://www.debugmode.com/wink/ Wink] [http://www.adobe.com/Captivate Adobe Captivate] [http://osflash.org/salasaga salasaga], etc.. offer interesting features in this direction but does no include the following criteria:

* Open source no effective solution is available as free software,
* Multi platform: no free solution is effective and free multi-platform
* Open standard: no effective solution uses open standards for export, import and playback of screencasts. The formats used are often Flash or video formats.
* Multi export: no effective solution proposes to use an intermediate format handling screencasts to, for example, offer several export / playback format of these screencasts.
* Searchable: Because of export formats selected by existing solutions, it is impossible to index (useful for search engines but also to improve the presentation of these screencasts) screencasts generated.
* Ergonomic: existing solutions are often not very ergonomic whether for recording screencasts for reading, for example, it is necessary to use the scroll bar of the Flash player or video search / access to a portion of the screencast particular.
* Web friendly: despite the fact that screencasts are designed for e-learning, none of the solutions are properly integrated with web technologies (HTML5, CSS, JS).

The developed solution will consist of three parts:
* Capture: a tool for capturing and editing written in JavaFX for Java + a) the recording of post-editing screencasts for adding meta-data (eg, texts, animations and information about screencasts b) , etc.)
* Intermediate Format: an intermediate format for storing the content, form and dynamics of screencasts. This format must be defined on open standards (XML, JSON, other), be extensible, and portable.
* Reading: a reader for viewing screencasts in a web browser (HTML5, JS, CSS).
