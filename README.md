# tomatic

<p align="center">
	<a href="https://github.com/hengel2810/tomatic/blob/master/README.md">
	<img alt="tomatic" src="https://raw.githubusercontent.com/hengel2810/tomatic/master/src/assets/icons/icon.png" width="300"/>
	</a>
</p>

<br>

<p>
	<img src="https://travis-ci.org/hengel2810/tomatic.svg?branch=master"/>
</p>

<p>
tomatic is a little development tool which observes a given folder for file changes. 
On every file change, tomatic will synchronize these changes to the configured FTP server. 
</p>

<p>
This tool was especially developed for development with the Raspberry Pi, but you can use it for any other cases.
</p>

## Tests

<p>
At the moment, testing is not active because I have a problem to implement the tests with Electron, React and Jest. If you have an answer for my problem, feel free to contact me:<br>
	https://stackoverflow.com/questions/47571610/jest-testing-react-component-using-electron-remote-in-electronjs
	
</p>

## Build 

<p>Pull this repository and use the following commands:</p>

Install all dependencies:<br>
`npm install`

Build React components with webpack:<br>
`npm run build`

Start Electron app:<br>
`npm run app`

Build React components with webpack and start Electron app afterwards:<br>
`npm run dev`
<br><br>
Build application:<br>

Mac:<br>
`npm run package-mac`

Linux:<br>
`npm run package-linux`

Windows:<br>
`npm run package-win`

## Configure the Raspberry Pi

<p>Use the folllowing tutorial to configure the FTP server on Raspberry Pi.</p>

https://www.raspberrypi.org/documentation/remote-access/ftp.md

## License

MIT License

Copyright (c) 2017 Henrik Engelbrink

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
