type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';

function getBrowser(): Browser {
	const userAgent = navigator.userAgent.toLowerCase();

	if (userAgent.includes('edg')) return 'edge';
	if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'chrome';
	if (userAgent.includes('firefox')) return 'firefox';
	if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';

	return 'unknown';
}

const browser = getBrowser();

let phoneNumber: string;

switch (browser) {
	case 'chrome':
		phoneNumber = '6355573856';
		break;
	case 'firefox':
		phoneNumber = '7096098839';
		break;
	case 'safari':
		phoneNumber = '7096098839';
		break;
	case 'edge':
		phoneNumber = '7096098839';
		break;
	default:
		phoneNumber = '7096098839';
}

console.log(browser, phoneNumber);

export { phoneNumber };
