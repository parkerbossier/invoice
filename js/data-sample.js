/*
 * All the data for the invoice goes here
 */
var Invoice = {
    baseRate: 20,
    clientAddress: [
        'Client Name',
        '836 Client St',
        'New York, NY 82736'
    ],
    date: 'September 1, 2014',
    defaultProject: 'Project A',
    number: 1,
    self: {
        address: [
            '3452 Your St',
            'Your City, CA 72635'
        ],
        email: 'you@yourdomain.com',
        phone: '(555) 867-5309',
        name: 'Your Full Name'
    },
    workItems: [
        {
            description: 'Work description for the work will work',
            hours: 1,
            minutes: 10,
            date: '8/18/2014'
        },
        {
            description: 'Work description for the work will work',
            hours: 0,
            minutes: 45,
            date: '8/18/2014'
        },
        {
            project: 'Project B',
            description: 'Work description for the work will work',
            hours: 2,
            minutes: 15,
            date: '8/18/2014'
        }
    ]
};
