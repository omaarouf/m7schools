/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {

  coursSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Home',
    },
    
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        // Intro
        'cours/networking/intro',

        // Groupe 0
        {
          type: 'category',
          label: 'Configuration de Base',
          items: [
            'cours/networking/configuration-de-base/switch',
            'cours/networking/configuration-de-base/router',
          ],
        },

        // Groupe 1
        {
          type: 'category',
          label: 'Switching',
          items: [
            'cours/networking/switching/vlans',
            'cours/networking/switching/stp',
            'cours/networking/switching/etherchannel',
          ],
        },

        // Groupe 2
        {
          type: 'category',
          label: 'Routage',
          items: [
            'cours/networking/routing/routage-statique',
            'cours/networking/routing/rip',
            'cours/networking/routing/ospf',
            'cours/networking/routing/eigrp',
            'cours/networking/routing/bgp',
          ],
        },

        // Groupe 3
        {
          type: 'category',
          label: 'Securite',
          items: [
            'cours/networking/securite/port-security',
            'cours/networking/securite/acl',
          ],
        },

        // Groupe 4
        {
          type: 'category',
          label: 'Gestion & Monitoring',
          items: [
            'cours/networking/gestion-monitoring/gestion-reseau',
          ],
        },

        // Groupe 5
        {
          type: 'category',
          label: 'Services Reseau',
          items: [
            'cours/networking/services-reseau/hsrp',
            'cours/networking/services-reseau/dhcp',
            'cours/networking/services-reseau/nat',
            'cours/networking/services-reseau/voip',
            'cours/networking/services-reseau/vpn',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'cours/windows/intro',
        'cours/windows/powershell-commandes-de-base',
        'cours/windows/configuration-de-base-win-server',
        'cours/windows/active-directory-cmd',
        'cours/windows/active-directory',
        'cours/windows/dhcp',
        'cours/windows/dns',
        'cours/windows/group-policy',
        //'cours/windows/file-services',
        //'cours/windows/iis-web-server',
        //'cours/windows/backup-recovery',
        
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'cours/linux/intro',
        'cours/linux/lesson-00',
        'cours/linux/lesson-01',
        'cours/linux/lesson-02',
        'cours/linux/lesson-03',
        'cours/linux/lesson-04',
        'cours/linux/lesson-05',
        'cours/linux/lesson-06',
        'cours/linux/lesson-07',
        'cours/linux/lesson-08',
        'cours/linux/lesson-09',
        'cours/linux/lesson-10',
        'cours/linux/lesson-11',
        'cours/linux/lesson-12',
      ],
    },
  ],

  quizzesSidebar: [
    {
    type: 'doc',
    id: 'quizzes/quizzes-intro',
    label: 'Quizzes',
    },
  
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        'quizzes/quiz-networking',
      ],
    },
    
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'quizzes/windows/quiz-powershell',
        'quizzes/windows/quiz-active-directory',
        'quizzes/windows/quiz-dhcp',
        'quizzes/windows/quiz-dns',
        'quizzes/windows/quiz-gpo',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'quizzes/linux/quizz-00-les-commandes-de-base',
        'quizzes/linux/ConfigurationDeBaseLinuxServer',
        'quizzes/linux/quizzDhcp',
        'quizzes/linux/quizzDNS',
        'quizzes/linux/quizzApache',
        'quizzes/linux/quizzLVM',
        'quizzes/linux/quizzRoutage',
        'quizzes/linux/quizzRaid',
        'quizzes/linux/quiz-ldap',
        'quizzes/linux/quiz-linux',
      ],
    },
      
    
  ],

  TpSidebar: [
    {
    type: 'doc',
    id: 'TP/tp-intro',
    label: 'TP Pratiques',
    },
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        'TP/networking/conception-reseau',
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'TP/windows/tp-powershell',
        'TP/windows/tp-configuration-de-base',
        'TP/windows/tp-active-directory',
        'TP/windows/tp-dhcp',
        'TP/windows/tp-dns',
        'TP/windows/tp-gpo',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'TP/linux/tp-lesson-00',
        'TP/linux/tp-Configuration-de-base',
        'TP/linux/tp-DHCP',
        'TP/linux/tp-DNS',
        'TP/linux/tp-Apache',
        'TP/linux/tp-LVM',
        'TP/linux/tp-Routage',
        'TP/linux/tp-Raid',
      ],
    },  
  ],
  EfmsSidebar: [
    {
    type: 'doc',
    id: 'EFMs/efms-intro',
    label: 'EFMs',
    },
    {
      type: 'category',
      label: 'EFMs Linux',
      collapsed: true,
      items: [
        'EFMs/linux/TTA-2022-2023-v1',
        'EFMs/linux/SOUSS-MASSA-2022-2023-v1',
        'EFMs/linux/RSK-2022-2023-v1',
        'EFMs/linux/RSK-2022-2023-v2',
        'EFMs/linux/BMK-2024-v2',
        'EFMs/linux/BMK-2024-v1',
        'EFMs/linux/BMK-2022-2023',
        'EFMs/linux/CASA-2022-2023-v1',




      ],
    },  
  ],

};

module.exports = sidebars;