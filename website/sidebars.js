module.exports = {
  docs: {
		Documentation: ['introduction', 'overview'],
    'Deploying Stratos': [
			'deploy/deploy-overview',
    	{
    		"Cloud Foundry": [
    			'deploy/cloud-foundry/cloud-foundry',
    			'deploy/cloud-foundry/db-migration',
    			'deploy/cloud-foundry/cf-troubleshooting'
    		],
    	},
    	{
    		Kubernetes: [
    			'deploy/kubernetes',
    			'deploy/kubernetes/helm-installation' 
    		],
    	},
    	'deploy/all-in-one',
			'deploy/access',
			'deploy/troubleshooting',
    ],
    'Advanced Topics': [
			'advanced/invite-user-guide',
			'advanced/sso'
		],
		'Contributing to Development': [
			'guides/contribution/contributing',
			'developer/introduction',
			{
			Frontend: [
				'developer/frontend',
				'developer/frontend-tests'
			]
			},
			{
				Backend: [
					'developer/backend',
				]
				},
				'developer/developers-guide-env-tech',
			'developer/developers-guide-e2e-tests'
	],
		'Extending Stratos': [
			'extensions/introduction',
			'guides/customization/customizing',
			'extensions/theming',
			'extensions/frontend',
			'extensions/backend',
		],
		
  },
};