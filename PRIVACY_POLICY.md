# SleepDuo Privacy Policy

SleepDuo is an open source Android app developed by Charles Bither. The source code is available on GitHub under the GNU General Public License v3.0.


## Data collected by SleepDuo

Your uuid and full name as it appears on your Google account will be collected if you login to SleepDuo via OAuth.

Any Record Details that you create in the app will be collected and stored on our cloud-based Supabase database. This may include any of the following for each log: 
* The number of alcoholic or caffinated drinks you had
* Whether you took a nap
* Your self-reported quality of sleep

The personal information you provide will not be shared, sold, or rented to any other third party except as required by law or with your explicit consent.


## Explanation of permissions requested by the SleepDuo

The only permission requested by SleepDuo can be found in the `app.json` file:

https://github.com/CharlesBither/SleepDuo/blob/abed34d7066019d4efe74d7ada9d4cfdd343f58e/app.json#L21-L23

`"android.permission.health.READ_SLEEP"` is a Health Connect app permission that is requested when pressing the "Set up Health Connect" button on the Home screen of the SleepDuo app. Allowing this permission will enable SleepDuo to render sleep data in the app such as your time asleep each night and your average daily sleep time.

##

If you have any questions regarding this policy, or if you would like to request the deletion of your data, please send me an email at sleepduo@charlesbither.com
