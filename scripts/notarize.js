require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }
    if (process.env.SKIP_NOTARIZE) {
        console.log("Skipping notarization...")
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    console.log("Notarizing...")

    return await notarize({
        appBundleId: 'be.codemine.buildnotifier',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
    }).then(() => console.log("Done Notarizing."));
};
