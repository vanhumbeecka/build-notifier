import AutoLaunch from 'auto-launch'

const autoLauncher = new AutoLaunch({
  name: "Build Notifier"
})

export const changeAutoLaunchOption = async (enable: boolean): Promise<boolean> => {
  const alreadyEnabled = await autoLauncher.isEnabled()
  if (enable && !alreadyEnabled) {
    await autoLauncher.enable()
  } else if (!enable && alreadyEnabled) {
    await autoLauncher.disable()
  }

  return await autoLauncher.isEnabled()
}
