# Ad Unit Configuration Based on Domain
This project provides a flexible ad unit configuration system that dynamically applies different ad unit settings based on the domain. It enables the use of a default configuration and domain-specific overrides to control properties such as ad templates, sizes, and display settings.

## Features
Default Configuration: A standard set of ad unit settings that apply to all domains unless overridden.  
Domain-Specific Overrides: Allows custom configurations for specific domains, adjusting ad sizes, peek amounts, and more.  
Automatic Application: The configuration is automatically injected based on the current domain, ensuring the correct ad settings are used.

## How It Works
The project defines a defaultConfig object that holds ad unit settings common to all domains. A seenThisOptions object contains overrides for specific domains.

When a page loads:
The system checks if the current domain has a configuration in `seenThisOptions`.
If a match is found, the domain-specific configuration is merged with the `defaultConfig`.
If no match is found, the default configuration is used, or the system returns null if no configuration should be applied.

## Example Domains:
jv.dk (default configuration).  
fyens.dk.com (domain-specific overrides).  
```javascript
const seenThisOptions = {
    'jv.dk': {}, // Empty config for 'jv.dk', will load default.
    'fyens.dk': { // Loads default settings + override if any key-value entries are different. 
      'mobile_2_outstream': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}{{ pathOverride }}mobile_2_outstream',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
      },
      'mobile_3': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}{{ pathOverride }}mobile_2_outstream',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
      }
    },
    // Additional domains can be added here
  };
```
Domains that are not listed in the configuration variable `seenThisOptions` are ignored, ensuring the code is only applied where needed.

## Code Structure
`defaultConfig`: Defines default ad units, including templates, sizes, and peek amounts.
`seenThisOptions`: Holds domain-specific overrides. Each key corresponds to a domain, and values represent custom settings for that domain.
Logic: The code checks if a domain exists in `seenThisOptions` and merges its configuration with the default settings if applicable.
Key Variables:
`{{ mappedDomain }}`: A global variable representing the current domain.
Object.assign(): Merges the domain-specific configuration with the default configuration.

## Usage
To add a new domain to the configuration, update the `seenThisOptions` object as follows:
```javascript
const seenThisOptions = {
  'dbrs.dk': {
    'mobile_3': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}{{ pathOverride }}mobile_3',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
      },
    'mobile_4': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}{{ pathOverride }}mobile_4',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
          }
      },
    'avisendanmark.dk': {
        'mobile_3': {
            template: 'midscroll',
            slot: '{{ pathPrefix }}{{ pathOverride }}mobile_3',
            sizes: [[300, 240], [320, 320]],
            peekAmount: '100vh' 
          },
        'mobile_4': {
            template: 'midscroll',
            slot: '{{ pathPrefix }}{{ pathOverride }}mobile_4',
            sizes: [[300, 240], [320, 320]],
            peekAmount: '100vh' 
          }
        }
    };
```
