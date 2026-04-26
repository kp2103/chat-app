type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';

function getBrowser(): Browser {
	const userAgent = navigator.userAgent.toLowerCase();

	if (userAgent.includes('edg')) return 'edge';

	if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'chrome';

	if (userAgent.includes('firefox')) return 'firefox';

	return 'unknown';
}

const browser = getBrowser();

let phoneNumber: string;

switch (browser) {
	case 'chrome':
		phoneNumber = '8409169809';
		break;

	case 'firefox':
		phoneNumber = '9978449197';
		break;

	case 'edge':
		phoneNumber = '7096098839';
		break;

	default:
		phoneNumber = '6355573856';
}

console.log(
	`Session initialized for browser: ${browser} with phone: ${phoneNumber}`,
);

export { phoneNumber };

