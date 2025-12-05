export default function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Money for Gamers',
        url: 'https://moneyforgamers.com',
        logo: 'https://moneyforgamers.com/logo.png',
        sameAs: [
            'https://facebook.com/moneyforgamers',
            'https://twitter.com/moneyforgamers',
            'https://instagram.com/moneyforgamers',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-XXX-XXX-XXXX',
            contactType: 'Customer Service',
            email: 'support@moneyforgamers.com',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
