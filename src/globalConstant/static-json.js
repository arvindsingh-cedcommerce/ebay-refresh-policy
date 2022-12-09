export const json = {
    amazon_feed_status : [
        { label :'_NOT_SUBMITTED_', value : 'Not Submitted'},
        { label :'_SUBMITTED_', value : 'Submitted'},
        { label :'_IN_PROGRESS_', value : 'In Progress'},
        { label :'_DONE_', value : 'Done'},
        { label :'_DONE_NO_DATA_', value : 'Done (No Data)'},
        { label :'_CANCELLED_', value : 'Cancelled (No Data)'},
    ],
    amazon_feed_type : [
        { label :'_POST_PRODUCT_DATA_', value : 'Product'},
        { label :'_POST_INVENTORY_AVAILABILITY_DATA_', value : 'Product Inventory'},
        { label :'_POST_PRODUCT_PRICING_DATA_', value : 'Product Price'},
        { label :'_POST_PRODUCT_IMAGE_DATA_', value : 'Product Image'},
        { label :'_POST_PRODUCT_RELATIONSHIP_DATA_', value : 'Product Relationship'},
        { label :'_POST_ORDER_FULFILLMENT_DATA_', value : 'Order Fulfillment'},
    ],
    amazon_marketplaceid_code : [
        { label:"BR",  value : "A2Q3Y263D00KWC"},
        { label: "CA",  value : "A2EUQ1WTGCTBG2"},
        { label: "MX",  value : "A1AM78C64UM0Y8"},
        { label: "US",  value : "ATVPDKIKX0DER"},
        { label: "AE",  value : "A2VIGQ35RCS4UG"},
        { label: "DE",  value : "A1PA6795UKMFR9"},
        { label: "EG",  value : "ARBP9OOSHTCHU"},
        { label: "ES",  value : "A1RKKUPIHCS9HS"},
        { label: "FR",  value : "A13V1IB3VIYZZH"},
        { label: "GB",  value : "A1F83G8C2ARO7P"},
        { label: "IN",  value : "A21TJRUUN4KGV"},
        { label: "IT",  value : "APJ6JRA9NG5V4"},
        { label: "NL",  value : "A1805IZSGTT6HS"},
        { label: "SA",  value : "A17E79C6D8DWNP"},
        { label: "SE",  value : "A2NODRKZP88ZB9"},
        { label: "TR",  value : "A33AVAJ2PDY3EV"},
        { label: "SG",  value : "A19VAU5U5O7RUS"},
        { label: "AU",  value : "A39IBJ37TRP1C6"},
        { label: "JP",  value : "A1VC38T7YXB528"},
    ],
    amazon_regions :[
        {value:"north_america", label: "North America"},
        {value:"europe", label: "Europe"},
        {value:"india",label: "India"},
        {value:"far_east", label: "Far East"},
    ],
    region_link:{
        north_america: 'https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1&developerName=Cedcommerce+Inc&devMWSAccountId=337320726556&',
        europe: 'https://sellercentral-europe.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1&developerName=Cedcommerce+Inc&devMWSAccountId=233623308975&',
        india: 'https://sellercentral.amazon.in/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1&developerName=Cedcommerce+Inc&devMWSAccountId=163411718947&',
        far_east: 'https://sellercentral.amazon.com.au/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1&developerName=Cedcommerce+Inc&devMWSAccountId=048563819005&',
    },
    region_marketplace :
        {
            north_america:[
                {code : "US",
                    value : "ATVPDKIKX0DER",
                    name : "US",
                    label : "US ['ATVPDKIKX0DER']"},
                {code : "CA",
                    value : "A2EUQ1WTGCTBG2",
                    name : "CA",
                    label : "CA ['A2EUQ1WTGCTBG2']"},
                {code : "MX",
                    value : "A1AM78C64UM0Y8",
                    name : "MX",
                    label : "MX ['A1AM78C64UM0Y8']"},
                {code : "BR",
                    value : "A2Q3Y263D00KWC",
                    name : "BR",
                    label : "BR ['A2Q3Y263D00KWC']"}
            ],
            europe: [
                {code : "AE",
                    value : "A2VIGQ35RCS4UG",
                    name : "AE",
                    label: "AE ['A2VIGQ35RCS4UG']"},
                {code : "DE",
                    value : "A1PA6795UKMFR9",
                    name : "DE",
                    label : "DE ['A1PA6795UKMFR9']"},
                {code : "EG",
                    value : "ARBP9OOSHTCHU",
                    name : "EG",
                    label : "EG ['ARBP9OOSHTCHU']"},
                {code : "ES",
                    value : "A1RKKUPIHCS9HS",
                    name : "ES",
                    label : "ES ['A1RKKUPIHCS9HS']"},
                {code : "FR",
                    value : "A13V1IB3VIYZZH",
                    name : "FR",
                    label : "FR ['A13V1IB3VIYZZH']"},
                {code : "UK",
                    value : "A1F83G8C2ARO7P",
                    name : "UK",
                    label : "UK ['A1F83G8C2ARO7P']"},
                {code : "IT",
                    value : "APJ6JRA9NG5V4",
                    name : "IT",
                    label : "IT ['APJ6JRA9NG5V4']"},
                {code : "NL",
                    value : "A1805IZSGTT6H",
                    name : "NL",
                    label : "NL ['A1805IZSGTT6HS']"},
                {code : "SA",
                    value : "A17E79C6D8DWNP",
                    name : "SA",
                    label : "SA ['A17E79C6D8DWNP']"},
                {code : "TR",
                    value : "A33AVAJ2PDY3EV",
                    name: "TR",
                    label : "TR ['A33AVAJ2PDY3EV']"}],
            india: [{code : "IN",
                value : "A21TJRUUN4KGV",
                name : "IN",
                label : "IN ['A21TJRUUN4KGV']"}],
            far_east: [{"code" : "SG",
                value : "A19VAU5U5O7RUS",
                name : "SG",
                label : "SG ['A19VAU5U5O7RUS']"},
                {code : "AU",
                    value : "A39IBJ37TRP1C6",
                    name : "AU",
                    label : "AU ['A39IBJ37TRP1C6']"},
                {code : "JP",
                    value : "A1VC38T7YXB528",
                    name : "JP",
                    label : "JP ['A1VC38T7YXB528']"}]
        },
    flag_country:[
        {
            value: "0",
            flag : "http://icons.iconarchive.com/icons/wikipedia/flags/256/US-United-States-Flag-icon.png",
            label: "United States",
            abbreviation: 'US',
            domainName: '.com'
        },
        {
            value: "2",
            flag:"https://cdn.countryflags.com/thumbs/canada/flag-waving-250.png",
            label: "Canada (Eng)",
            abbreviation: 'ENCA',
            domainName: '.ca'
        },
        {
            value: "3",
            flag :"https://cdn3.iconfinder.com/data/icons/world-flags-square-vol-3/48/United_Kingdom-512.png",
            label: "UK",
            abbreviation: 'GB',
            domainName: '.co.uk'
        },
        {
            value: "15",
            flag:"https://cdn3.iconfinder.com/data/icons/world-flags-square-vol-1/48/Australia-512.png",
            label: "Australia",
            abbreviation: 'AU',
            domainName: '.com.au'
        },
        {
            value: "16",
            flag:"https://cdn.countryflags.com/thumbs/austria/flag-400.png",
            label: "Austria",
            abbreviation: 'AT',
            domainName: '.at'
        },
        {
            value: "23",
            flag:"https://cdn.countryflags.com/thumbs/belgium/flag-400.png",
            label: "Belgium (Fn)",
            abbreviation: 'FRBE',
            domainName: '.com'

        },
        {
            value: "71",
            flag:"https://cdn.countryflags.com/thumbs/france/flag-400.png",
            label: "France",
            abbreviation: 'FR',
            domainName: '.fr'
        },
        {
            value: "77",
            flag:"https://cdn.countryflags.com/thumbs/germany/flag-400.png",
            label: "Germany",
            abbreviation: 'DE',
            domainName: '.de'
        },
        {
            value: "100",
            flag:"https://images.latintimes.com/sites/latintimes.com/files/styles/large/public/imotortimes//2013/07/09/2012/06/30/1939-ebay.jpg",
            label: "Motors",
            abbreviation: 'MOTOR',
            domainName: '.com/motors'
        },
        {
            value: "101",
            flag:"https://cdn.countryflags.com/thumbs/italy/flag-400.png",
            label: "Italy",
            abbreviation: 'IT',
            domainName: '.it'
        },
        {
            value: "123",
            flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPEAAADRCAMAAAAquaQNAAAAGFBMVEUAAADtKTn64EK6pjH/5EP65EL2rz/sFTloj3DsAAAA6ElEQVR4nO3PSREAMAwEoPSMf8c1sa8OOKAqbO2ZdG6PrHTY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Pin8QMYsNKjONgoFgAAAABJRU5ErkJggg==",
            label: "Belgium (Dutch)",
            abbreviation: 'NLBE',
            domainName: '.be'
        },
        {
            value: "146",
            flag:"https://cdn.countryflags.com/thumbs/netherlands/flag-400.png",
            label: "Netherlands",
            abbreviation: 'NL',
            domainName: '.nl'
        },
        {
            value: "186",
            flag:"https://cdn.countryflags.com/thumbs/spain/flag-400.png",
            label: "Spain",
            abbreviation: 'ES',
            domainName: '.es'
        },
        {
            value: "193",
            flag:"https://images-na.ssl-images-amazon.com/images/I/31SpFDViB2L.jpg",
            label: "Switzerland",
            abbreviation: 'CH',
            domainName: '.ch'
        },
        {
            value: "201",
            flag:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Hong_Kong.svg/2000px-Flag_of_Hong_Kong.svg.png",
            label: "Hong Kong",
            abbreviation: 'HK',
            domainName: '.com.hk'
        },
        // {
        //     value: "203",
        //     flag:"https://cdn.countryflags.com/thumbs/india/flag-400.png",
        //     label: "India"
        // },
        {
            value: "205",
            flag:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/255px-Flag_of_Ireland.svg.png",
            label: "Ireland",
            abbreviation: 'IE',
            domainName: '.ie'
        },
        {
            value: "207",
            flag:"https://www.shareicon.net/download/2017/01/17/871951_flag_512x512.png",
            label: "Malaysia",
            abbreviation: 'MY',
            domainName: '.com/my'
        },
        {
            value: "210",
            flag:"https://cdn.countryflags.com/thumbs/canada/flag-waving-250.png",
            label: "Canada (French)",
            abbreviation: 'FRCA',
            domainName: '.com'
        },
        {
            value: "211",
            flag:"https://cdn.countryflags.com/thumbs/philippines/flag-400.png",
            label: "Philippines",
            abbreviation: 'PH',
            domainName: '.ph'
        },
        {
            value: "212",
            flag:"https://cdn.countryflags.com/thumbs/poland/flag-400.png",
            label: "Poland",
            abbreviation: 'PL',
            domainName: '.pl'
        },
        {
            value: "216",
            flag:"https://cdn.countryflags.com/thumbs/singapore/flag-400.png",
            label: "Singapore",
            abbreviation: 'SG',
            domainName: '.com/sg'
        }
    ],

    country: [
        {
            "value": "0",
            "label": "eBay United States"
        },
        {
            "value": "2",
            "label": "eBay Canada (English)"
        },
        {
            "value": "3",
            "label": "eBay UK"
        },
        {
            "value": "15",
            "label": "eBay Australia"
        },
        {
            "value": "16",
            "label": "eBay Austria"
        },
        {
            "value": "23",
            "label": "eBay Belgium (French)"
        },
        {
            "value": "71",
            "label": "eBay France"
        },
        {
            "value": "77",
            "label": "eBay Germany"
        },
        {
            "value": "100",
            "label": "eBay Motors"
        },
        {
            "value": "101",
            "label": "eBay Italy"
        },
        {
            "value": "123",
            "label": "eBay Belgium (Dutch)"
        },
        {
            "value": "146",
            "label": "eBay Netherlands"
        },
        {
            "value": "186",
            "label": "eBay Spain"
        },
        {
            "value": "193",
            "label": "eBay Switzerland"
        },
        {
            "value": "201",
            "label": "eBay Hong Kong"
        },
        {
            "value": "203",
            "label": "eBay India"
        },
        {
            "value": "205",
            "label": "eBay Ireland"
        },
        {
            "value": "207",
            "label": "eBay Malaysia"
        },
        {
            "value": "210",
            "label": "eBay Canada (French)"
        },
        {
            "value": "211",
            "label": "eBay Philippines"
        },
        {
            "value": "212",
            "label": "eBay Poland"
        },
        {
            "value": "216",
            "label": "eBay Singapore"
        }
    ],
    country_mobile_code: [
        {
            "label": "Afghanistan",
            "phone_code": "+93",
            "value": "AF"
        },
        {
            "label": "Aland Islands",
            "phone_code": "+358",
            "value": "AX"
        },
        {
            "label": "Albania",
            "phone_code": "+355",
            "value": "AL"
        },
        {
            "label": "Algeria",
            "phone_code": "+213",
            "value": "DZ"
        },
        {
            "label": "AmericanSamoa",
            "phone_code": "+1684",
            "value": "AS"
        },
        {
            "label": "Andorra",
            "phone_code": "+376",
            "value": "AD"
        },
        {
            "label": "Angola",
            "phone_code": "+244",
            "value": "AO"
        },
        {
            "label": "Anguilla",
            "phone_code": "+1264",
            "value": "AI"
        },
        {
            "label": "Antarctica",
            "phone_code": "+672",
            "value": "AQ"
        },
        {
            "label": "Antigua and Barbuda",
            "phone_code": "+1268",
            "value": "AG"
        },
        {
            "label": "Argentina",
            "phone_code": "+54",
            "value": "AR"
        },
        {
            "label": "Armenia",
            "phone_code": "+374",
            "value": "AM"
        },
        {
            "label": "Aruba",
            "phone_code": "+297",
            "value": "AW"
        },
        {
            "label": "Australia",
            "phone_code": "+61",
            "value": "AU"
        },
        {
            "label": "Austria",
            "phone_code": "+43",
            "value": "AT"
        },
        {
            "label": "Azerbaijan",
            "phone_code": "+994",
            "value": "AZ"
        },
        {
            "label": "Bahamas",
            "phone_code": "+1242",
            "value": "BS"
        },
        {
            "label": "Bahrain",
            "phone_code": "+973",
            "value": "BH"
        },
        {
            "label": "Bangladesh",
            "phone_code": "+880",
            "value": "BD"
        },
        {
            "label": "Barbados",
            "phone_code": "+1246",
            "value": "BB"
        },
        {
            "label": "Belarus",
            "phone_code": "+375",
            "value": "BY"
        },
        {
            "label": "Belgium",
            "phone_code": "+32",
            "value": "BE"
        },
        {
            "label": "Belize",
            "phone_code": "+501",
            "value": "BZ"
        },
        {
            "label": "Benin",
            "phone_code": "+229",
            "value": "BJ"
        },
        {
            "label": "Bermuda",
            "phone_code": "+1441",
            "value": "BM"
        },
        {
            "label": "Bhutan",
            "phone_code": "+975",
            "value": "BT"
        },
        {
            "label": "Bolivia, Plurinational State of",
            "phone_code": "+591",
            "value": "BO"
        },
        {
            "label": "Bosnia and Herzegovina",
            "phone_code": "+387",
            "value": "BA"
        },
        {
            "label": "Botswana",
            "phone_code": "+267",
            "value": "BW"
        },
        {
            "label": "Brazil",
            "phone_code": "+55",
            "value": "BR"
        },
        {
            "label": "British Indian Ocean Territory",
            "phone_code": "+246",
            "value": "IO"
        },
        {
            "label": "Brunei Darussalam",
            "phone_code": "+673",
            "value": "BN"
        },
        {
            "label": "Bulgaria",
            "phone_code": "+359",
            "value": "BG"
        },
        {
            "label": "Burkina Faso",
            "phone_code": "+226",
            "value": "BF"
        },
        {
            "label": "Burundi",
            "phone_code": "+257",
            "value": "BI"
        },
        {
            "label": "Cambodia",
            "phone_code": "+855",
            "value": "KH"
        },
        {
            "label": "Cameroon",
            "phone_code": "+237",
            "value": "CM"
        },
        {
            "label": "Canada",
            "phone_code": "+1",
            "value": "CA"
        },
        {
            "label": "Cape Verde",
            "phone_code": "+238",
            "value": "CV"
        },
        {
            "label": "Cayman Islands",
            "phone_code": "+ 345",
            "value": "KY"
        },
        {
            "label": "Central African Republic",
            "phone_code": "+236",
            "value": "CF"
        },
        {
            "label": "Chad",
            "phone_code": "+235",
            "value": "TD"
        },
        {
            "label": "Chile",
            "phone_code": "+56",
            "value": "CL"
        },
        {
            "label": "China",
            "phone_code": "+86",
            "value": "CN"
        },
        {
            "label": "Christmas Island",
            "phone_code": "+61",
            "value": "CX"
        },
        {
            "label": "Cocos (Keeling) Islands",
            "phone_code": "+61",
            "value": "CC"
        },
        {
            "label": "Colombia",
            "phone_code": "+57",
            "value": "CO"
        },
        {
            "label": "Comoros",
            "phone_code": "+269",
            "value": "KM"
        },
        {
            "label": "Congo",
            "phone_code": "+242",
            "value": "CG"
        },
        {
            "label": "Congo, The Democratic Republic of the Congo",
            "phone_code": "+243",
            "value": "CD"
        },
        {
            "label": "Cook Islands",
            "phone_code": "+682",
            "value": "CK"
        },
        {
            "label": "Costa Rica",
            "phone_code": "+506",
            "value": "CR"
        },
        {
            "label": "Cote d'Ivoire",
            "phone_code": "+225",
            "value": "CI"
        },
        {
            "label": "Croatia",
            "phone_code": "+385",
            "value": "HR"
        },
        {
            "label": "Cuba",
            "phone_code": "+53",
            "value": "CU"
        },
        {
            "label": "Cyprus",
            "phone_code": "+357",
            "value": "CY"
        },
        {
            "label": "Czech Republic",
            "phone_code": "+420",
            "value": "CZ"
        },
        {
            "label": "Denmark",
            "phone_code": "+45",
            "value": "DK"
        },
        {
            "label": "Djibouti",
            "phone_code": "+253",
            "value": "DJ"
        },
        {
            "label": "Dominica",
            "phone_code": "+1767",
            "value": "DM"
        },
        {
            "label": "Dominican Republic",
            "phone_code": "+1849",
            "value": "DO"
        },
        {
            "label": "Ecuador",
            "phone_code": "+593",
            "value": "EC"
        },
        {
            "label": "Egypt",
            "phone_code": "+20",
            "value": "EG"
        },
        {
            "label": "El Salvador",
            "phone_code": "+503",
            "value": "SV"
        },
        {
            "label": "Equatorial Guinea",
            "phone_code": "+240",
            "value": "GQ"
        },
        {
            "label": "Eritrea",
            "phone_code": "+291",
            "value": "ER"
        },
        {
            "label": "Estonia",
            "phone_code": "+372",
            "value": "EE"
        },
        {
            "label": "Ethiopia",
            "phone_code": "+251",
            "value": "ET"
        },
        {
            "label": "Falkland Islands (Malvinas)",
            "phone_code": "+500",
            "value": "FK"
        },
        {
            "label": "Faroe Islands",
            "phone_code": "+298",
            "value": "FO"
        },
        {
            "label": "Fiji",
            "phone_code": "+679",
            "value": "FJ"
        },
        {
            "label": "Finland",
            "phone_code": "+358",
            "value": "FI"
        },
        {
            "label": "France",
            "phone_code": "+33",
            "value": "FR"
        },
        {
            "label": "French Guiana",
            "phone_code": "+594",
            "value": "GF"
        },
        {
            "label": "French Polynesia",
            "phone_code": "+689",
            "value": "PF"
        },
        {
            "label": "Gabon",
            "phone_code": "+241",
            "value": "GA"
        },
        {
            "label": "Gambia",
            "phone_code": "+220",
            "value": "GM"
        },
        {
            "label": "Georgia",
            "phone_code": "+995",
            "value": "GE"
        },
        {
            "label": "Germany",
            "phone_code": "+49",
            "value": "DE"
        },
        {
            "label": "Ghana",
            "phone_code": "+233",
            "value": "GH"
        },
        {
            "label": "Gibraltar",
            "phone_code": "+350",
            "value": "GI"
        },
        {
            "label": "Greece",
            "phone_code": "+30",
            "value": "GR"
        },
        {
            "label": "Greenland",
            "phone_code": "+299",
            "value": "GL"
        },
        {
            "label": "Grenada",
            "phone_code": "+1473",
            "value": "GD"
        },
        {
            "label": "Guadeloupe",
            "phone_code": "+590",
            "value": "GP"
        },
        {
            "label": "Guam",
            "phone_code": "+1671",
            "value": "GU"
        },
        {
            "label": "Guatemala",
            "phone_code": "+502",
            "value": "GT"
        },
        {
            "label": "Guernsey",
            "phone_code": "+44",
            "value": "GG"
        },
        {
            "label": "Guinea",
            "phone_code": "+224",
            "value": "GN"
        },
        {
            "label": "Guinea-Bissau",
            "phone_code": "+245",
            "value": "GW"
        },
        {
            "label": "Guyana",
            "phone_code": "+595",
            "value": "GY"
        },
        {
            "label": "Haiti",
            "phone_code": "+509",
            "value": "HT"
        },
        {
            "label": "Holy See (Vatican City State)",
            "phone_code": "+379",
            "value": "VA"
        },
        {
            "label": "Honduras",
            "phone_code": "+504",
            "value": "HN"
        },
        {
            "label": "Hong Kong",
            "phone_code": "+852",
            "value": "HK"
        },
        {
            "label": "Hungary",
            "phone_code": "+36",
            "value": "HU"
        },
        {
            "label": "Iceland",
            "phone_code": "+354",
            "value": "IS"
        },
        {
            "label": "India",
            "phone_code": "+91",
            "value": "IN"
        },
        {
            "label": "Indonesia",
            "phone_code": "+62",
            "value": "ID"
        },
        {
            "label": "Iran, Islamic Republic of Persian Gulf",
            "phone_code": "+98",
            "value": "IR"
        },
        {
            "label": "Iraq",
            "phone_code": "+964",
            "value": "IQ"
        },
        {
            "label": "Ireland",
            "phone_code": "+353",
            "value": "IE"
        },
        {
            "label": "Isle of Man",
            "phone_code": "+44",
            "value": "IM"
        },
        {
            "label": "Israel",
            "phone_code": "+972",
            "value": "IL"
        },
        {
            "label": "Italy",
            "phone_code": "+39",
            "value": "IT"
        },
        {
            "label": "Jamaica",
            "phone_code": "+1876",
            "value": "JM"
        },
        {
            "label": "Japan",
            "phone_code": "+81",
            "value": "JP"
        },
        {
            "label": "Jersey",
            "phone_code": "+44",
            "value": "JE"
        },
        {
            "label": "Jordan",
            "phone_code": "+962",
            "value": "JO"
        },
        {
            "label": "Kazakhstan",
            "phone_code": "+77",
            "value": "KZ"
        },
        {
            "label": "Kenya",
            "phone_code": "+254",
            "value": "KE"
        },
        {
            "label": "Kiribati",
            "phone_code": "+686",
            "value": "KI"
        },
        {
            "label": "Korea, Democratic People's Republic of Korea",
            "phone_code": "+850",
            "value": "KP"
        },
        {
            "label": "Korea, Republic of South Korea",
            "phone_code": "+82",
            "value": "KR"
        },
        {
            "label": "Kuwait",
            "phone_code": "+965",
            "value": "KW"
        },
        {
            "label": "Kyrgyzstan",
            "phone_code": "+996",
            "value": "KG"
        },
        {
            "label": "Laos",
            "phone_code": "+856",
            "value": "LA"
        },
        {
            "label": "Latvia",
            "phone_code": "+371",
            "value": "LV"
        },
        {
            "label": "Lebanon",
            "phone_code": "+961",
            "value": "LB"
        },
        {
            "label": "Lesotho",
            "phone_code": "+266",
            "value": "LS"
        },
        {
            "label": "Liberia",
            "phone_code": "+231",
            "value": "LR"
        },
        {
            "label": "Libyan Arab Jamahiriya",
            "phone_code": "+218",
            "value": "LY"
        },
        {
            "label": "Liechtenstein",
            "phone_code": "+423",
            "value": "LI"
        },
        {
            "label": "Lithuania",
            "phone_code": "+370",
            "value": "LT"
        },
        {
            "label": "Luxembourg",
            "phone_code": "+352",
            "value": "LU"
        },
        {
            "label": "Macao",
            "phone_code": "+853",
            "value": "MO"
        },
        {
            "label": "Macedonia",
            "phone_code": "+389",
            "value": "MK"
        },
        {
            "label": "Madagascar",
            "phone_code": "+261",
            "value": "MG"
        },
        {
            "label": "Malawi",
            "phone_code": "+265",
            "value": "MW"
        },
        {
            "label": "Malaysia",
            "phone_code": "+60",
            "value": "MY"
        },
        {
            "label": "Maldives",
            "phone_code": "+960",
            "value": "MV"
        },
        {
            "label": "Mali",
            "phone_code": "+223",
            "value": "ML"
        },
        {
            "label": "Malta",
            "phone_code": "+356",
            "value": "MT"
        },
        {
            "label": "Marshall Islands",
            "phone_code": "+692",
            "value": "MH"
        },
        {
            "label": "Martinique",
            "phone_code": "+596",
            "value": "MQ"
        },
        {
            "label": "Mauritania",
            "phone_code": "+222",
            "value": "MR"
        },
        {
            "label": "Mauritius",
            "phone_code": "+230",
            "value": "MU"
        },
        {
            "label": "Mayotte",
            "phone_code": "+262",
            "value": "YT"
        },
        {
            "label": "Mexico",
            "phone_code": "+52",
            "value": "MX"
        },
        {
            "label": "Micronesia, Federated States of Micronesia",
            "phone_code": "+691",
            "value": "FM"
        },
        {
            "label": "Moldova",
            "phone_code": "+373",
            "value": "MD"
        },
        {
            "label": "Monaco",
            "phone_code": "+377",
            "value": "MC"
        },
        {
            "label": "Mongolia",
            "phone_code": "+976",
            "value": "MN"
        },
        {
            "label": "Montenegro",
            "phone_code": "+382",
            "value": "ME"
        },
        {
            "label": "Montserrat",
            "phone_code": "+1664",
            "value": "MS"
        },
        {
            "label": "Morocco",
            "phone_code": "+212",
            "value": "MA"
        },
        {
            "label": "Mozambique",
            "phone_code": "+258",
            "value": "MZ"
        },
        {
            "label": "Myanmar",
            "phone_code": "+95",
            "value": "MM"
        },
        {
            "label": "Namibia",
            "phone_code": "+264",
            "value": "NA"
        },
        {
            "label": "Nauru",
            "phone_code": "+674",
            "value": "NR"
        },
        {
            "label": "Nepal",
            "phone_code": "+977",
            "value": "NP"
        },
        {
            "label": "Netherlands",
            "phone_code": "+31",
            "value": "NL"
        },
        {
            "label": "Netherlands Antilles",
            "phone_code": "+599",
            "value": "AN"
        },
        {
            "label": "New Caledonia",
            "phone_code": "+687",
            "value": "NC"
        },
        {
            "label": "New Zealand",
            "phone_code": "+64",
            "value": "NZ"
        },
        {
            "label": "Nicaragua",
            "phone_code": "+505",
            "value": "NI"
        },
        {
            "label": "Niger",
            "phone_code": "+227",
            "value": "NE"
        },
        {
            "label": "Nigeria",
            "phone_code": "+234",
            "value": "NG"
        },
        {
            "label": "Niue",
            "phone_code": "+683",
            "value": "NU"
        },
        {
            "label": "Norfolk Island",
            "phone_code": "+672",
            "value": "NF"
        },
        {
            "label": "Northern Mariana Islands",
            "phone_code": "+1670",
            "value": "MP"
        },
        {
            "label": "Norway",
            "phone_code": "+47",
            "value": "NO"
        },
        {
            "label": "Oman",
            "phone_code": "+968",
            "value": "OM"
        },
        {
            "label": "Pakistan",
            "phone_code": "+92",
            "value": "PK"
        },
        {
            "label": "Palau",
            "phone_code": "+680",
            "value": "PW"
        },
        {
            "label": "Palestinian Territory, Occupied",
            "phone_code": "+970",
            "value": "PS"
        },
        {
            "label": "Panama",
            "phone_code": "+507",
            "value": "PA"
        },
        {
            "label": "Papua New Guinea",
            "phone_code": "+675",
            "value": "PG"
        },
        {
            "label": "Paraguay",
            "phone_code": "+595",
            "value": "PY"
        },
        {
            "label": "Peru",
            "phone_code": "+51",
            "value": "PE"
        },
        {
            "label": "Philippines",
            "phone_code": "+63",
            "value": "PH"
        },
        {
            "label": "Pitcairn",
            "phone_code": "+872",
            "value": "PN"
        },
        {
            "label": "Poland",
            "phone_code": "+48",
            "value": "PL"
        },
        {
            "label": "Portugal",
            "phone_code": "+351",
            "value": "PT"
        },
        {
            "label": "Puerto Rico",
            "phone_code": "+1939",
            "value": "PR"
        },
        {
            "label": "Qatar",
            "phone_code": "+974",
            "value": "QA"
        },
        {
            "label": "Romania",
            "phone_code": "+40",
            "value": "RO"
        },
        {
            "label": "Russia",
            "phone_code": "+7",
            "value": "RU"
        },
        {
            "label": "Rwanda",
            "phone_code": "+250",
            "value": "RW"
        },
        {
            "label": "Reunion",
            "phone_code": "+262",
            "value": "RE"
        },
        {
            "label": "Saint Barthelemy",
            "phone_code": "+590",
            "value": "BL"
        },
        {
            "label": "Saint Helena, Ascension and Tristan Da Cunha",
            "phone_code": "+290",
            "value": "SH"
        },
        {
            "label": "Saint Kitts and Nevis",
            "phone_code": "+1869",
            "value": "KN"
        },
        {
            "label": "Saint Lucia",
            "phone_code": "+1758",
            "value": "LC"
        },
        {
            "label": "Saint Martin",
            "phone_code": "+590",
            "value": "MF"
        },
        {
            "label": "Saint Pierre and Miquelon",
            "phone_code": "+508",
            "value": "PM"
        },
        {
            "label": "Saint Vincent and the Grenadines",
            "phone_code": "+1784",
            "value": "VC"
        },
        {
            "label": "Samoa",
            "phone_code": "+685",
            "value": "WS"
        },
        {
            "label": "San Marino",
            "phone_code": "+378",
            "value": "SM"
        },
        {
            "label": "Sao Tome and Principe",
            "phone_code": "+239",
            "value": "ST"
        },
        {
            "label": "Saudi Arabia",
            "phone_code": "+966",
            "value": "SA"
        },
        {
            "label": "Senegal",
            "phone_code": "+221",
            "value": "SN"
        },
        {
            "label": "Serbia",
            "phone_code": "+381",
            "value": "RS"
        },
        {
            "label": "Seychelles",
            "phone_code": "+248",
            "value": "SC"
        },
        {
            "label": "Sierra Leone",
            "phone_code": "+232",
            "value": "SL"
        },
        {
            "label": "Singapore",
            "phone_code": "+65",
            "value": "SG"
        },
        {
            "label": "Slovakia",
            "phone_code": "+421",
            "value": "SK"
        },
        {
            "label": "Slovenia",
            "phone_code": "+386",
            "value": "SI"
        },
        {
            "label": "Solomon Islands",
            "phone_code": "+677",
            "value": "SB"
        },
        {
            "label": "Somalia",
            "phone_code": "+252",
            "value": "SO"
        },
        {
            "label": "South Africa",
            "phone_code": "+27",
            "value": "ZA"
        },
        {
            "label": "South Sudan",
            "phone_code": "+211",
            "value": "SS"
        },
        {
            "label": "South Georgia and the South Sandwich Islands",
            "phone_code": "+500",
            "value": "GS"
        },
        {
            "label": "Spain",
            "phone_code": "+34",
            "value": "ES"
        },
        {
            "label": "Sri Lanka",
            "phone_code": "+94",
            "value": "LK"
        },
        {
            "label": "Sudan",
            "phone_code": "+249",
            "value": "SD"
        },
        {
            "label": "Surilabel",
            "phone_code": "+597",
            "value": "SR"
        },
        {
            "label": "Svalbard and Jan Mayen",
            "phone_code": "+47",
            "value": "SJ"
        },
        {
            "label": "Swaziland",
            "phone_code": "+268",
            "value": "SZ"
        },
        {
            "label": "Sweden",
            "phone_code": "+46",
            "value": "SE"
        },
        {
            "label": "Switzerland",
            "phone_code": "+41",
            "value": "CH"
        },
        {
            "label": "Syrian Arab Republic",
            "phone_code": "+963",
            "value": "SY"
        },
        {
            "label": "Taiwan",
            "phone_code": "+886",
            "value": "TW"
        },
        {
            "label": "Tajikistan",
            "phone_code": "+992",
            "value": "TJ"
        },
        {
            "label": "Tanzania, United Republic of Tanzania",
            "phone_code": "+255",
            "value": "TZ"
        },
        {
            "label": "Thailand",
            "phone_code": "+66",
            "value": "TH"
        },
        {
            "label": "Timor-Leste",
            "phone_code": "+670",
            "value": "TL"
        },
        {
            "label": "Togo",
            "phone_code": "+228",
            "value": "TG"
        },
        {
            "label": "Tokelau",
            "phone_code": "+690",
            "value": "TK"
        },
        {
            "label": "Tonga",
            "phone_code": "+676",
            "value": "TO"
        },
        {
            "label": "Trinidad and Tobago",
            "phone_code": "+1868",
            "value": "TT"
        },
        {
            "label": "Tunisia",
            "phone_code": "+216",
            "value": "TN"
        },
        {
            "label": "Turkey",
            "phone_code": "+90",
            "value": "TR"
        },
        {
            "label": "Turkmenistan",
            "phone_code": "+993",
            "value": "TM"
        },
        {
            "label": "Turks and Caicos Islands",
            "phone_code": "+1649",
            "value": "TC"
        },
        {
            "label": "Tuvalu",
            "phone_code": "+688",
            "value": "TV"
        },
        {
            "label": "Uganda",
            "phone_code": "+256",
            "value": "UG"
        },
        {
            "label": "Ukraine",
            "phone_code": "+380",
            "value": "UA"
        },
        {
            "label": "United Arab Emirates",
            "phone_code": "+971",
            "value": "AE"
        },
        {
            "label": "United Kingdom",
            "phone_code": "+44",
            "value": "GB"
        },
        {
            "label": "United States",
            "phone_code": "+1",
            "value": "US"
        },
        {
            "label": "Uruguay",
            "phone_code": "+598",
            "value": "UY"
        },
        {
            "label": "Uzbekistan",
            "phone_code": "+998",
            "value": "UZ"
        },
        {
            "label": "Vanuatu",
            "phone_code": "+678",
            "value": "VU"
        },
        {
            "label": "Venezuela, Bolivarian Republic of Venezuela",
            "phone_code": "+58",
            "value": "VE"
        },
        {
            "label": "Vietnam",
            "phone_code": "+84",
            "value": "VN"
        },
        {
            "label": "Virgin Islands, British",
            "phone_code": "+1284",
            "value": "VG"
        },
        {
            "label": "Virgin Islands, U.S.",
            "phone_code": "+1340",
            "value": "VI"
        },
        {
            "label": "Wallis and Futuna",
            "phone_code": "+681",
            "value": "WF"
        },
        {
            "label": "Yemen",
            "phone_code": "+967",
            "value": "YE"
        },
        {
            "label": "Zambia",
            "phone_code": "+260",
            "value": "ZM"
        },
        {
            "label": "Zimbabwe",
            "phone_code": "+263",
            "value": "ZW"
        }
    ],
    sources: [
        {label: 'Shopify App Store', value: 'Shopify App Store'},
        {label: 'Google Ads', value: 'Google Ads'},
        {label: 'FaceBook Ads', value: 'FaceBook Ads'},
        {label: 'Twitter', value: 'Twitter'},
        {label: 'Yahoo', value: 'Yahoo'},
        {label: 'Youtube', value: 'Youtube'},
        {label: 'Other', value: 'Other'},
    ]
};
