import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const workbook = {
  Dashboard: [
    {
      'Clover Girls Club — Event Organizer Dashboard': 'Organizer Workflow',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': '1. Track every payment in Expenses or Income.',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': '2. Add all potential purchases to Things to Buy before buying.',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': '3. Use Venue Research for venue options, quotes, capacity, inclusions, and follow-ups.',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': '4. Use Event Checklist to assign owners and deadlines.',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': '5. Update Dashboard before making major purchases.',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': 'Sip, Paint & Meet ',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': 'Event',
      'Unnamed: 1': '# Attendees',
      'Unnamed: 2': 'Payments Rcvd',
      'Unnamed: 3': 'Entrance Fee',
      'Unnamed: 4': 'Total Income (payments rcvd x entrance fee)',
      'Unnamed: 5': 'Food Budget/head',
      'Unnamed: 6': 'Total Food Budget (attendees x food budget)',
      'Unnamed: 7': 'Venue Rental Fee',
      'Unnamed: 9': 'Total Income',
      'Unnamed: 10': 28850.0,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': 'Sip, Paint Meet - QC Sept 05',
      'Unnamed: 1': 23,
      'Unnamed: 2': '20',
      'Unnamed: 3': 550,
      'Unnamed: 4': 11000,
      'Unnamed: 5': 300,
      'Unnamed: 6': 6900,
      'Unnamed: 7': 6900,
      'Unnamed: 9': 'Total Expenses',
      'Unnamed: 10': 16525.0,
    },
    {
      'Clover Girls Club — Event Organizer Dashboard': 'Sip, Paint Meet - Makati Sept 12',
      'Unnamed: 1': 20,
      'Unnamed: 2': 21,
      'Unnamed: 3': 850,
      'Unnamed: 4': 17850,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': 4500,
      'Unnamed: 9': 'Net Cash Flow',
      'Unnamed: 10': 12325.0,
    },
  ],
  'Sept Events EXPSTTB': [
    {
      Description: "QC (SEVEN O'CLOCK) EXPENSES/THINGS TO BUY",
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: null,
      'Actual Cost': null,
      'Purchased?': null,
      Notes: null,
    },
    {
      Description: 'Calling Card',
      Priority: 'High',
      'Estimated Cost': 299,
      'Quantity/Details': '100 ocs',
      Link: null,
      Types: 'Marketing/Promotion',
      'Actual Cost': 299,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Deposit',
      Priority: 'High',
      'Estimated Cost': 3000,
      'Quantity/Details': '4 hrs',
      Link: null,
      Types: 'Event Space Deposit',
      'Actual Cost': 3000,
      'Purchased?': 'Yes',
      Notes: 'Ibabalik after event (to Clover Jann)',
    },
    {
      Description: 'Watercolor Palette',
      Priority: 'High',
      'Estimated Cost': 183,
      'Quantity/Details': '25 pcs',
      Link: null,
      Types: 'Event Materials',
      'Actual Cost': 183,
      'Purchased?': 'Yes',
      Notes: 'some are broken - need to buy another',
    },
    {
      Description: 'Waterbrush Pen',
      Priority: 'High',
      'Estimated Cost': 285,
      'Quantity/Details': '25 pcs',
      Link: null,
      Types: 'Event Materials',
      'Actual Cost': 285,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Grab',
      Priority: 'Low',
      'Estimated Cost': 302,
      'Quantity/Details': null,
      Link: null,
      Types: 'Event Operations (Transpo & others)',
      'Actual Cost': 302,
      'Purchased?': 'Yes',
      Notes: 'Cornerhouse to Seven O\'clock',
    },
    {
      Description: 'Kalmellow',
      Priority: 'Low',
      'Estimated Cost': 1380,
      'Quantity/Details': '1 pc w freebie',
      Link: null,
      Types: 'Marketing/Promotion',
      'Actual Cost': 1380,
      'Purchased?': 'Yes',
      Notes: 'Raffle for the girlies (Makati)',
    },
    {
      Description: 'Watercolor Paint',
      Priority: 'High',
      'Estimated Cost': 496,
      'Quantity/Details': '4 pcs',
      Link: null,
      Types: 'Event Materials',
      'Actual Cost': 496,
      'Purchased?': 'Yes',
      Notes: 'need to buy more - too small',
    },
    {
      Description: 'Watercolor Paper',
      Priority: 'High',
      'Estimated Cost': 246,
      'Quantity/Details': '50 pcs',
      Link: null,
      Types: 'Event Materials',
      'Actual Cost': 246,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Table Runner',
      Priority: 'High',
      'Estimated Cost': 261,
      'Quantity/Details': '3 pcs',
      Link: null,
      Types: 'Decoration/Equipments',
      'Actual Cost': 261,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Mirror',
      Priority: 'Medium',
      'Estimated Cost': 987,
      'Quantity/Details': '1 pc',
      Link: null,
      Types: 'Decoration/Equipments',
      'Actual Cost': 987,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: null,
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: 'TOTAL:',
      'Actual Cost': 7439,
      'Purchased?': null,
      Notes: null,
    },
    {
      Description: 'Venue',
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: 'Venue Rental',
      'Actual Cost': 6900,
      'Purchased?': '23 Attendees',
      Notes: '20 payments received',
    },
    {
      Description: 'Description',
      Priority: 'Priority',
      'Estimated Cost': 'Estimated Cost',
      'Quantity/Details': 'Quantity/Details',
      Link: 'Link',
      Types: 'Types',
      'Actual Cost': 'Actual Cost',
      'Purchased?': 'Purchased?',
      Notes: 'Notes',
    },
    {
      Description: 'MAKATI (Habonera) EXPENSES/THINGS TO BUY',
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: null,
      'Actual Cost': null,
      'Purchased?': null,
      Notes: null,
    },
    {
      Description: 'QC Venue',
      Priority: 'High',
      'Estimated Cost': 1000,
      'Quantity/Details': 'additional',
      Link: null,
      Types: 'Venue Rental',
      'Actual Cost': 1000,
      'Purchased?': null,
      Notes: 'need addtl 1k for seven oclock venue',
    },
    {
      Description: 'ADS (Aug 20 )',
      Priority: 'High',
      'Estimated Cost': 100,
      'Quantity/Details': '1 day, Follower count',
      Link: null,
      Types: 'Marketing/Promotion',
      'Actual Cost': 100,
      'Purchased?': 'Yes',
      Notes: 'Paid by Clover Jann',
    },
    {
      Description: 'Flyer for Makati',
      Priority: 'High',
      'Estimated Cost': 160,
      'Quantity/Details': '100 pcs',
      Link: null,
      Types: 'Marketing/Promotion',
      'Actual Cost': 160,
      'Purchased?': 'Yes',
      Notes: 'Paid by Clover Jann',
    },
    {
      Description: 'Watercolor Paint ',
      Priority: 'High',
      'Estimated Cost': 273,
      'Quantity/Details': '3 pcs',
      Link: 'https://ph.shp.ee/x8x8h6B7',
      Types: 'Event Materials',
      'Actual Cost': 841,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Watercolor Brushes',
      Priority: 'High',
      'Estimated Cost': 226,
      'Quantity/Details': '12pcs - 3 set',
      Link: 'https://ph.shp.ee/u7nVJkcP',
      Types: 'Event Materials',
      'Actual Cost': 688,
      'Purchased?': 'Yes',
      Notes: '36pcs total - clean ittt',
    },
    {
      Description: 'Watercolor Palette/Pencil/Marker',
      Priority: 'High',
      'Estimated Cost': 176,
      'Quantity/Details': '20pc/10pcs/2pcs',
      Link: 'https://ph.shp.ee/DrHcACoP',
      Types: 'Event Materials',
      'Actual Cost': 176,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Buffet Tray',
      Priority: 'Medium',
      'Estimated Cost': 252,
      'Quantity/Details': '1 pc',
      Link: 'https://ph.shp.ee/6B4eQC9z',
      Types: 'Decoration/Equipments',
      'Actual Cost': 252,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Cake Stand',
      Priority: 'Medium',
      'Estimated Cost': 369,
      'Quantity/Details': '1pc Large',
      Link: 'https://onelink.shein.com/49/5zpdhh9mcrh8?shc=2_RpUbagA1vck',
      Types: 'Decoration/Equipments',
      'Actual Cost': 369,
      'Purchased?': 'Yes',
      Notes: 'For Bread/Snacks',
    },
    {
      Description: 'Plastic Thongs',
      Priority: 'Medium',
      'Estimated Cost': 169,
      'Quantity/Details': '8 pcs',
      Link: 'https://ph.shp.ee/KWo9ghUY',
      Types: 'Decoration/Equipments',
      'Actual Cost': 169,
      'Purchased?': 'Yes',
      Notes: 'mas pricey kapag 4 pcs lang',
    },
    {
      Description: 'Small Paper Plate',
      Priority: 'Medium',
      'Estimated Cost': 161,
      'Quantity/Details': '50 pcs',
      Link: 'https://ph.shp.ee/cyLNMF4j',
      Types: 'Food/Snacks',
      'Actual Cost': 161,
      'Purchased?': 'Yes',
      Notes: 'for food/snacks',
    },
    {
      Description: 'Paper Cups 3oz',
      Priority: 'Medium',
      'Estimated Cost': 100,
      'Quantity/Details': '100 pcs',
      Link: 'https://ph.shp.ee/UF1C6kr8',
      Types: 'Drinks',
      'Actual Cost': 76,
      'Purchased?': 'Yes',
      Notes: 'for water & watercolor ',
    },
    {
      Description: 'Plastic Cups 12oz',
      Priority: 'Medium',
      'Estimated Cost': 100,
      'Quantity/Details': '50 pcs',
      Link: 'https://ph.shp.ee/vXvzEP2a',
      Types: 'Drinks',
      'Actual Cost': 128,
      'Purchased?': 'Yes',
      Notes: 'Matcha & Iced Tea',
    },
    {
      Description: 'Paper Straw',
      Priority: 'Medium',
      'Estimated Cost': 100,
      'Quantity/Details': '50 pcs',
      Link: 'https://ph.shp.ee/6uXuKxGJ',
      Types: 'Drinks',
      'Actual Cost': 122,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Sauce Clear Container 2oz',
      Priority: 'Medium',
      'Estimated Cost': 100,
      'Quantity/Details': '50 pcs',
      Link: null,
      Types: 'Decoration/Equipments',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: 'Matcha',
    },
    {
      Description: 'Standee for A2 logo',
      Priority: 'Medium',
      'Estimated Cost': 300,
      'Quantity/Details': '1pc',
      Link: 'https://ph.shp.ee/qnuLuCtF',
      Types: 'Decoration/Equipments',
      'Actual Cost': 279,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Food',
      Priority: 'High',
      'Estimated Cost': 1000,
      'Quantity/Details': 'for 20 people',
      Link: null,
      Types: 'Food/Snacks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: 'Cocopan/Charcuterie Board',
    },
    {
      Description: 'Matcha Powder',
      Priority: 'High',
      'Estimated Cost': 300,
      'Quantity/Details': '1pc - 100g',
      Link: 'https://ph.shp.ee/qL1ErJbE',
      Types: 'Drinks',
      'Actual Cost': 315,
      'Purchased?': 'Yes',
      Notes: null,
    },
    {
      Description: 'Oatside Milk',
      Priority: 'High',
      'Estimated Cost': 200,
      'Quantity/Details': null,
      Link: null,
      Types: 'Drinks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Honey',
      Priority: 'High',
      'Estimated Cost': 150,
      'Quantity/Details': null,
      Link: null,
      Types: 'Drinks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Ice',
      Priority: 'High',
      'Estimated Cost': 100,
      'Quantity/Details': null,
      Link: null,
      Types: 'Drinks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Bonchon Iced Tea',
      Priority: 'High',
      'Estimated Cost': 150,
      'Quantity/Details': null,
      Link: null,
      Types: 'Drinks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Mirror Sticker',
      Priority: 'Medium',
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: 'Drinks',
      'Actual Cost': null,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: 'Venue',
      Priority: 'High',
      'Estimated Cost': 4250,
      'Quantity/Details': null,
      Link: null,
      Types: 'Venue Rental',
      'Actual Cost': 4250,
      'Purchased?': 'No',
      Notes: null,
    },
    {
      Description: null,
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: 'TOTAL:',
      'Actual Cost': 9086,
      'Purchased?': null,
      Notes: null,
    },
    {
      Description: 'Description',
      Priority: 'Priority',
      'Estimated Cost': 'Estimated Cost',
      'Quantity/Details': 'Quantity/Details',
      Link: 'Link',
      Types: 'Types',
      'Actual Cost': 'Actual Cost',
      'Purchased?': 'Purchased?',
      Notes: 'Notes',
    },
    {
      Description: 'NEXT EVENT EXPENSES/THINGS TO BUY',
      Priority: null,
      'Estimated Cost': null,
      'Quantity/Details': null,
      Link: null,
      Types: null,
      'Actual Cost': null,
      'Purchased?': null,
      Notes: null,
    },
  ],
  'Venue + Payments': [
    {
      'VENUE ': 'Venue',
      'Unnamed: 1': 'Location',
      'Unnamed: 2': 'Date',
      'Unnamed: 3': 'Time',
      'Unnamed: 4': 'Deposit',
      'Unnamed: 5': 'Capacity',
      'Unnamed: 6': 'Rental Fee',
      'Unnamed: 7': 'Hours',
      'Unnamed: 8': 'Batch',
      'Unnamed: 9': 'Total Estimated Venue + Food',
      'Unnamed: 10': 'Status',
      'Unnamed: 11': 'Availability',
      'Unnamed: 13': null,
      'Unnamed: 14': 'Notes',
    },
    {
      'VENUE ': "Seven O'Clock Cafe",
      'Unnamed: 1': 'Tomas Morato, QC',
      'Unnamed: 2': '2026-09-05T00:00:00.000',
      'Unnamed: 3': '15:30:00',
      'Unnamed: 4': 3000,
      'Unnamed: 5': '23',
      'Unnamed: 6': 300,
      'Unnamed: 7': '4hrs',
      'Unnamed: 8': 1,
      'Unnamed: 9': 6900,
      'Unnamed: 10': 'Booked',
      'Unnamed: 11': 'Confirmed',
      'Unnamed: 13': null,
      'Unnamed: 14': 'Current event venue',
    },
    {
      'VENUE ': 'Habonera Studio',
      'Unnamed: 1': 'Paseo, Magallanes, Makati',
      'Unnamed: 2': '2026-09-12T00:00:00.000',
      'Unnamed: 3': '16:00:00',
      'Unnamed: 4': 2500,
      'Unnamed: 5': '20',
      'Unnamed: 6': 4500,
      'Unnamed: 7': '3hrs',
      'Unnamed: 8': 2,
      'Unnamed: 9': 4500,
      'Unnamed: 10': 'Booked',
      'Unnamed: 11': 'Confirmed',
      'Unnamed: 13': null,
      'Unnamed: 14': null,
    },
    {
      'VENUE ': 'PAYMENTS',
      'Unnamed: 1': null,
      'Unnamed: 2': null,
      'Unnamed: 3': null,
      'Unnamed: 4': null,
      'Unnamed: 5': null,
      'Unnamed: 6': null,
      'Unnamed: 7': null,
      'Unnamed: 8': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
      'Unnamed: 11': null,
      'Unnamed: 13': null,
      'Unnamed: 14': null,
    },
    {
      'VENUE ': 'Venue',
      'Unnamed: 1': 'Price',
      'Unnamed: 2': 'Payments Received',
      'Unnamed: 3': 'Payments Amt Received',
      'Unnamed: 4': 'Attendees',
      'Unnamed: 5': 'Free Slots (Influences, etc)',
      'Unnamed: 6': 'Batch',
      'Unnamed: 7': null,
      'Unnamed: 8': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
      'Unnamed: 11': null,
      'Unnamed: 13': 'Status',
      'Unnamed: 14': 'Notes',
    },
    {
      'VENUE ': "Seven O'Clock Cafe",
      'Unnamed: 1': 550,
      'Unnamed: 2': 20,
      'Unnamed: 3': 11000,
      'Unnamed: 4': 23,
      'Unnamed: 5': 3,
      'Unnamed: 6': 1,
      'Unnamed: 7': null,
      'Unnamed: 8': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
      'Unnamed: 11': null,
      'Unnamed: 13': null,
      'Unnamed: 14': null,
    },
    {
      'VENUE ': 'Habonera Studio',
      'Unnamed: 1': '850 + 720',
      'Unnamed: 2': '18 + 3',
      'Unnamed: 3': 17000,
      'Unnamed: 4': 20,
      'Unnamed: 5': null,
      'Unnamed: 6': 2,
      'Unnamed: 7': null,
      'Unnamed: 8': null,
      'Unnamed: 9': null,
      'Unnamed: 10': null,
      'Unnamed: 11': null,
      'Unnamed: 13': null,
      'Unnamed: 14': null,
    },
  ],
  Events: [
    {
      'Event Name': 'Sip, Paint & Meet - QC',
      Date: '2026-09-05T00:00:00.000',
      Venue: "Seven O'clock",
      Capacity: 25.0,
      'Registered Girls': 23.0,
      'Entrance Fee / Girl': 550.0,
      'Food Cost / Girl': 300.0,
      'Total Food Cost': 7200.0,
      'Other Event Expenses': '2 50% influencer , 1 Sponsor free (-1,100)',
    },
    {
      'Event Name': 'Sip, Paint & Meet - Makait B1',
      Date: '2026-09-12T00:00:00.000',
      Venue: 'Habonera Studio',
      Capacity: 20.0,
      'Registered Girls': 20.0,
      'Entrance Fee / Girl': 850.0,
      'Food Cost / Girl': 150.0,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'How to use',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Enter each new event on a new row. Change capacity, registered girls, entrance fee and food cost per girl.',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Other Event Expenses should include materials, venue rental, marketing, decorations, transport, etc.',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Portfolio Totals',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Total Entrance Income',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Total Food Cost',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Total Other Expenses',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
    {
      'Event Name': 'Total Profit',
      Date: null,
      Venue: null,
      Capacity: null,
      'Registered Girls': null,
      'Entrance Fee / Girl': null,
      'Food Cost / Girl': null,
      'Total Food Cost': null,
      'Other Event Expenses': null,
    },
  ],
  Income: [
    {
      Date: '2026-09-05T00:00:00.000',
      Time: '15:30:00',
      Venue: "Seven O'Clock Cafe",
      Batch: 'Batch 1',
      Status: 'Expected',
    },
    {
      Date: '2026-09-12T00:00:00.000',
      Time: '16:00:00',
      Venue: 'Habonera',
      Batch: 'Batch 1',
      Status: 'Expected',
    },
  ],
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = Object.fromEntries(
  envFile
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return null;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      return [key, value];
    })
    .filter(Boolean)
);

const url = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function assertEventsSchema() {
  const { error } = await supabase
    .from('events')
    .select('id, notes, other_expenses_notes')
    .limit(1);

  if (error && /notes|other_expenses_notes/i.test(error.message)) {
    throw new Error(
      'Missing events columns. Run the SQL from init.sql in the Supabase SQL editor before importing the spreadsheet data.'
    );
  }

  if (error) throw error;
}

const safeDateString = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = raw.includes('T') ? raw : raw.replace(/\s+/g, 'T');
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const matches = value.match(/-?\d[\d,]*/g);
    if (!matches || matches.length === 0) return 0;
    const last = matches[matches.length - 1].replace(/,/g, '');
    const parsed = Number(last);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toBool = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'yes' || normalized === 'y' || normalized === 'true' || normalized === '1';
  }
  return Boolean(value);
};

const trimLabel = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const getEventNameByContext = (description) => {
  const text = trimLabel(description).toLowerCase();
  if (text.includes('makati') || text.includes('habonera')) return 'Sip, Paint & Meet - Makait B1';
  return 'Sip, Paint & Meet - QC';
};

const isIgnorableRow = (row) => {
  if (!row || typeof row !== 'object') return true;
  const values = Object.values(row).filter((v) => v !== null && v !== undefined && String(v).trim() !== '');
  if (values.length === 0) return true;
  const first = trimLabel(row['Event Name'] ?? row.Description ?? row['VENUE '] ?? row.Date ?? row['Date'] ?? '');
  if (!first) return true;
  const ignoreList = [
    'How to use',
    'Enter each new event on a new row.',
    'Other Event Expenses should include materials, venue rental, marketing, decorations, transport, etc.',
    'Portfolio Totals',
    'Total Entrance Income',
    'Total Food Cost',
    'Total Other Expenses',
    'Total Profit',
    'Description',
    'NEXT EVENT EXPENSES/THINGS TO BUY',
    'PAYMENTS',
  ];
  return ignoreList.some((item) => first.startsWith(item) || first.includes(item));
};

async function clearTable(table) {
  const { data, error: loadErr } = await supabase.from(table).select('id');
  if (loadErr) throw loadErr;
  if (!data || data.length === 0) return;
  const ids = data.map((row) => row.id);
  const { error: deleteErr } = await supabase.from(table).delete().in('id', ids);
  if (deleteErr) throw deleteErr;
}

async function main() {
  await assertEventsSchema();
  await clearTable('income_records');
  await clearTable('expenses');
  await clearTable('venues');
  await clearTable('events');

  const eventRows = workbook.Events.filter((row) => !isIgnorableRow(row) && trimLabel(row['Event Name']))
    .map((row) => ({
      name: trimLabel(row['Event Name']),
      date: safeDateString(row.Date),
      venue_name: trimLabel(row.Venue || ''),
      capacity: Number(row.Capacity || 0),
      registered_count: Number(row['Registered Girls'] || 0),
      entrance_fee_per_girl: toNumber(row['Entrance Fee / Girl']),
      food_cost_per_girl: toNumber(row['Food Cost / Girl']),
      other_expenses: toNumber(row['Other Event Expenses']),
      other_expenses_notes: typeof row['Other Event Expenses'] === 'string' && row['Other Event Expenses']
        ? row['Other Event Expenses']
        : null,
    }));

  const { data: insertedEvents, error: insertEventsErr } = await supabase
    .from('events')
    .insert(eventRows)
    .select();

  if (insertEventsErr) throw insertEventsErr;

  const eventMap = new Map(insertedEvents.map((event) => [event.name, event.id]));

  const venueRows = workbook['Venue + Payments']
    .filter((row) => {
      const venueName = trimLabel(row['VENUE ']);
      if (!venueName || ['Venue', 'PAYMENTS'].includes(venueName)) return false;
      const status = trimLabel(row['Unnamed: 10'] ?? '');
      return status !== '';
    })
    .map((row) => ({
      name: trimLabel(row['VENUE ']),
      location: trimLabel(row['Unnamed: 1'] ?? ''),
      date: safeDateString(row['Unnamed: 2']),
      time: trimLabel(row['Unnamed: 3'] ?? ''),
      deposit: toNumber(row['Unnamed: 4']),
      capacity: Number(row['Unnamed: 5'] || 0),
      rental_fee: toNumber(row['Unnamed: 6']),
      hours: trimLabel(row['Unnamed: 7'] ?? ''),
      batch: trimLabel(row['Unnamed: 8'] ?? ''),
      status: trimLabel(row['Unnamed: 10'] ?? 'Pending'),
      availability: trimLabel(row['Unnamed: 11'] ?? ''),
      notes: trimLabel(row['Unnamed: 14'] ?? ''),
    }));

  const { data: insertedVenues, error: insertVenueErr } = await supabase
    .from('venues')
    .insert(venueRows)
    .select();

  if (insertVenueErr) throw insertVenueErr;

  const venueMap = new Map(insertedVenues.map((venue) => [venue.name, venue.id]));

  const expenseRows = [];
  let currentEventLabel = 'Sip, Paint & Meet - QC';

  for (const row of workbook['Sept Events EXPSTTB']) {
    const description = row.Description;
    if (typeof description === 'string') {
      if (description.toLowerCase().includes('qc')) {
        currentEventLabel = 'Sip, Paint & Meet - QC';
        continue;
      }
      if (description.toLowerCase().includes('makati') || description.toLowerCase().includes('habonera')) {
        currentEventLabel = 'Sip, Paint & Meet - Makait B1';
        continue;
      }
      if (description === 'Description' || description === 'NEXT EVENT EXPENSES/THINGS TO BUY') {
        continue;
      }
    }

    if (!description || description === 'TOTAL:' || description === 'Description') continue;
    const values = Object.values(row).filter((v) => v !== null && v !== undefined && String(v).trim() !== '');
    if (values.length === 0) continue;

    const cost = toNumber(row['Actual Cost']);
    const estimate = toNumber(row['Estimated Cost']);
    const purchased = toBool(row['Purchased?']);

    expenseRows.push({
      event_id: eventMap.get(currentEventLabel) ?? null,
      description: trimLabel(description),
      priority: ['High', 'Medium', 'Low'].includes(trimLabel(row.Priority || '')) ? trimLabel(row.Priority) : 'Medium',
      estimated_cost: estimate,
      actual_cost: cost,
      is_purchased: purchased,
      item_type: trimLabel(row.Types || ''),
      item_link: trimLabel(row.Link || ''),
      notes: trimLabel(row.Notes || ''),
      quantity_details: trimLabel(row['Quantity/Details'] || ''),
    });
  }

  const { error: insertExpensesErr } = await supabase.from('expenses').insert(expenseRows);
  if (insertExpensesErr) throw insertExpensesErr;

  const incomeRows = workbook.Income
    .filter((row) => row.Venue)
    .map((row) => {
      const venueName = trimLabel(row.Venue || '');
      const matchedEvent = insertedEvents.find((event) => event.venue_name === 'Seven O\'clock' || event.venue_name === 'Habonera Studio');
      const amount = venueName.toLowerCase().includes('seven') ? 11000 : 17000;
      return {
        event_id: eventMap.get(venueName.toLowerCase().includes('seven') ? 'Sip, Paint & Meet - QC' : 'Sip, Paint & Meet - Makait B1') || null,
        date: safeDateString(row.Date),
        time: trimLabel(row.Time || ''),
        amount,
        venue_name: venueName,
        batch: trimLabel(row.Batch || ''),
        status: trimLabel(row.Status || 'Pending'),
        notes: `Spreadsheet batch for ${venueName}`,
      };
    });

  const { error: insertIncomeErr } = await supabase.from('income_records').insert(incomeRows);
  if (insertIncomeErr) throw insertIncomeErr;

  console.log(JSON.stringify({
    events: insertedEvents.length,
    venues: insertedVenues.length,
    expenses: expenseRows.length,
    income: incomeRows.length,
  }, null, 2));
}

main().catch((error) => {
  console.error('Import failed');
  console.error(error);
  process.exit(1);
});
