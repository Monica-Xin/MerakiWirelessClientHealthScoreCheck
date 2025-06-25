# MerakiWirelessClientHealthScoreCheck
Wireless Network Health Score Check Tool									
												
												
Concept Introduction												
Performance Latest: the client's wireless connectivity for the last 2 hours. The percentage shown reflects the percentage of good SNR out of the total time connected during the last 2 hours. 
Performance is considered good when SNR is over 25dB.												
Performance currenConnect：the current client's wireless connectivity												
Onboarding Latest：how reliably they're able to connect to the wireless network. The percentage shown is the percentage of successful connections to the network 
(where the client was able to pass traffic) out of the total connections they've attempted in the last 2 hours.												
Realated KB：https://documentation.meraki.com/General_Administration/Cross-Platform_Content/Meraki_Health_Overview/Meraki_Health_-_Client_Details											
												
Purpose												
"This Health Check Tool is a Google Apps Script-based solution designed to check daily wirless clients connection status of Meraki devices within a network. 
It allows users to efficiently check wirless clients onboarding and SNR status using a Google Sheets interface. 
The tool interacts with the Meraki Early Access API to fetch and update device information, saving time and reducing manual effort for network administrators."												
												
Prerequisites												
A Google account with access to Google Sheets and Google Apps Script.												
A valid Meraki Network ID and API Key for authentication.												
ORG enabled API early access												
												
Easy to start												
Go to the "GetInfo" sheet												
Select the time range you want												
												
Notes												
Ensure the Meraki API key has the necessary permissions to read and modify device configurations.												
"This tool needs to collect data first, so after filling in the network ID and API ID in the ""GetInfo"" sheet, please go to Google Apps Script's Triggers and ensure that the following triggers are running properly:
1.TimmerTrigger
2.SummaryTrigger
3.GetInfo
If not, just go to each function and click ""run"", about ""GetInfo"" function, choose ""setupDropdownAndChar"" sub-function to run"
About "Clear" button, please note it will permanently delete all sheets except for 'Read Me' and 'GetInfo', and the operation cannot be undone. Please click it with caution.
"As KB mentioned, If the dashboard does not have enough data within the past 2 hours, or if it's a wired client, the Onboarding/Performance columns will show N/A in the respective fields. 
This includes clients that are connected to the network but are not sending any traffic or are connected to an AP that cannot run firmware MR27.5 or above.
A client may also show N/A in the Onboarding column if there is no connection activity in the past 2 hours from that specific device.
We will skip ""N/A"" during compute average performance and onboarding												
