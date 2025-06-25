# MerakiWirelessClientHealthScoreCheck
Wireless Network Health Score Check Tool									
												
												
**Concept Introduction**

**Performance Latest**: The client's wireless connectivity for the last 2 hours. The percentage shown reflects the percentage of good SNR out of the total time connected during the last 2 hours.

Performance is considered good when SNR is over 25dB.

**Performance Current Connect**: The current client's wireless connectivity.

**Onboarding Latest**: How reliably the client is able to connect to the wireless network.

The percentage shown reflects the percentage of successful connections to the network (where the client was able to pass traffic) out of the total connections attempted in the last 2 hours.
Related KB: [Meraki Health - Client Details](https://documentation.meraki.com/General_Administration/Cross-Platform_Content/Meraki_Health_Overview/Meraki_Health_-_Client_Details\)



**Purpose**

"This Health Check Tool is a Google Apps Script-based solution designed to check the daily wireless clients' connection status of Meraki devices within a network.
It allows users to efficiently check wireless clients' onboarding and SNR status using a Google Sheets interface.
The tool interacts with the Meraki Early Access API to fetch and update device information, saving time and reducing manual effort for network administrators."



**Prerequisites**

A Google account with access to Google Sheets and Google Apps Script.

A valid Meraki Network ID and API Key for authentication.

Organization enabled API Early Access.


**Easy to Start**

Go to the "GetInfo" sheet.

Select the time range you want.


**Notes**

Ensure the Meraki API key has the necessary permissions to read and modify device configurations.

This tool needs to collect data first, so after filling in the Network ID and API Key in the "GetInfo" sheet, please go to Google Apps Script's Triggers and ensure that the following triggers are running properly:

TimerTrigger
SummaryTrigger
GetInfo
(If not, just go to each function and click "Run". For the "GetInfo" function, choose the "setupDropdownAndChar" sub-function to run.)

About the "Clear" button:**Please note it will permanently delete all sheets except for 'Read Me' and 'GetInfo', and the operation cannot be undone.Use it with caution.**

Additional Notes:

As mentioned in the [KB](https://documentation.meraki.com/General_Administration/Cross-Platform_Content/Meraki_Health_Overview/Meraki_Health_-_Client_Details\), if the dashboard does not have enough data within the past 2 hours, or if it's a wired client, the Onboarding/Performance columns will show N/A in the respective fields.
This includes clients that are connected to the network but are not sending any traffic or are connected to an AP that cannot run firmware MR27.5 or above.
A client may also show N/A in the Onboarding column if there is no connection activity in the past 2 hours from that specific device.

N/A Handling:
We will skip "N/A" during the computation of average performance and onboarding.
