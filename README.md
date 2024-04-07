# Llamafile-Chat-Electron-Remix\n\n<img src="./public/favicon.png" width="200" />\n\nThis is a template for creating a Remix + Llamafile + Electron application.\n\n## Setup\n\n```shellscript\nnpx create-remix@latest --template myawad/Llamafile-Chat-Electron-Remix\n```\n\n## Development\n\nInstall dependencies and rebuild the native modules for Electron:\n\n```shellscript\nnpm install && npm run rebuild\n```\n\nYou can develop your app just like you would a normal Remix app, via:\n\n```shellscript\nnpm run dev\n```\n\n## Production\n\nWhen you are ready to build a production version of your app:\n\n```shellscript\nnpm run build\n```\n\nwill generate your production assets.\n\n```shellscript\nnpm run package\n```\n\nwill package your app in