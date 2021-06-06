# TheDarkestHouse-TMScript
Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)

# Overview
The Darkest House is an electron app (a custom packaged "chrome-like" browser) that simply browses a wordpress site for the content of The Darkest House.  If you can get the url and username and password to the wordpress site, you can browse to it directly without using the electron app and then use this TamperMonkey script to add usability.

* Adds an edit icon to each "card" on a screen.  This button allows you to edit paragraphs within the card.
* Adds a "plus" icon to the bottom of each card when editing is enbled.  This allows you to add an additional paragraph to the card.  (You can just hit enter a couple of times in an existing paragraph, and it amounts to the same thing)
* Add "Show to players" links anywhere there is a "Download" link.  This opens a new named window for whatever file would be downloaded.  This allows you to just leave this other window visible to your players and whatever you click "Show to players" on will automatically show up there with a single click.

The changes you make are saved using the localStorage api, so they are stored on your computer, not sent to me, or montecookgames.com, or any third-party storage site.

## Caveats
There are caveats that I'm not going to bother dealing with right now.  If people actually use this script, I'll get them fixed...
* I've only tested with FireFox and TamperMonkey.  I don't know how other userscript extensions may handle it or how other browsers may handle it.  I will say that my downloaded local version running basically the same script works fine in chrome.
* Saving a card actually saves the entire card set.  This means that if you mark 3 cards for editing, save one card, then change pages and come back, the other 2 cards will already have their changes saved, and will still be marked editable.  It also means that any cards that are expaned will be saved as expanded, etc.  I just collapse them all back down and do a final edit then save.
* I didn't add code to work with the fancy page transition that shows the Darkest House image between screens.  Instead, I just completely disabled it.  I believe the transition works by intercepting a link click and manually loading the pieces of a page behind the scenes instead of letting the browser just load the page.  Since the page load completion is when the new icons get added, the page transition prevents them from being added (since the new page never really loads).  I'm sure there's some event I can catch at the end of the transition, but it was easier just to handle the link clicks on my own and stop the transition altogether.
* An "undo/redo" button is added at the top by the index and map buttons.  This simply alternates between the original data and the modified data for the entire cardset.  There's no way to revert for a single card and there's no way to see differences inline or anything.  In fact, since the edit buttons are part of the cardset, there's not even a way to revert and then restart editing; the edit buttons disappear when the original is restored.  I can add that if it's necessary.
* Your modifications are stored wherever the browser stores localStorage, so I don't know how complicated it would be if you had to move that to another computer or something.

# Getting your Url and Username and Password
In order to use this, you will first need to find the url, username, and password for your instance of The Darkest House.  There are at least a couple of ways.  One is to run [Fiddler](https://www.telerik.com/fiddler)(https://www.telerik.com/fiddler).When you run the app, you'll see a page at thedarkesthouse.com get a 401 error.  The attempt will be retried, but this time a base64 encoded username and password will be sent in the Authorization header.  For example,
	Authorization: Basic Ym9iYnlqb2U6aGlzbGVmdGZvb3Q=
The encoded part of that is "bobbyjoe:hisleftfoot".  You can get it either by using fiddler's TextWizard or any online base64 decoder.  The part before the colon is the username and the part after is the password.  Then you just browse to the same url and enter that username and password.

An alternative way is to decode your asar file and look at the javascript code there. I use [7-zip](https://www.7-zip.org/)(https://www.7-zip.org/) and an [asar plugin for 7-zip](https://www.tc4shell.com/en/7zip/asar/)(https://www.tc4shell.com/en/7zip/asar/).  My asar file is located at C:\Users\UserName\AppData\Local\darkest-house-app\app-1.0.0\resources.  Once you find that, use 7-zip to extract it to a new directory.  Then go to the src/index.js file within that new folder.  Open that up and look for the createWindow function (mine is on line 49).  The default value passed for the url parameter of function is the url of your instance of The Darkest House (I bet it's the same for everyone, or at least for a large group, but I could be wrong.)
```javascript
function createWindow(url='https://blahblah.thedarkesthouse.com/') {
```
That line says that the url for the wordpress site is `https://blahblah.thedarkesthouse.com`.

Now, find the app.on('login'... setup.  Mine is on line 177.
```javascript
//Provide the credentials for the server
app.on('login', (event, webContents, details, authInfo, callback) => {
    event.preventDefault()
    callback('someusername', '1*(&(laah)')
})
```
The `callback` line is listing the username and password.  The first part (`someusername`) is the username and the second parameter (`1*(&(laah)`) is the password.
Then you use those to log in to the wordpress site you found in the createWindow call.

# Install the script
Once you've got that information, you just need to install the script.  If you have the TamperMonkey extension installed, you can just click [this script link](https://github.com/HardlyForeal/TheDarkestHouse-TMScript/raw/main/TheDarkestHouse-TMScript.user.js)(https://github.com/HardlyForeal/TheDarkestHouse-TMScript/raw/main/TheDarkestHouse-TMScript.user.js).  TamperMonkey should come up with an install screen and you just have to hit the install button.  Once that's done, you should get the edit buttons and everything any time you "visit the house".
