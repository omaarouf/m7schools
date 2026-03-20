/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {

  couresSidebar: [
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
        'idosr/networking/intro',
        'idosr/networking/lesson-01',
        'idosr/networking/lesson-02',
        'idosr/networking/lesson-03',
        'idosr/networking/lesson-04',
        
        'idosr/networking/lesson-06',
        'idosr/networking/lesson-07',
        'idosr/networking/lesson-08',
        'idosr/networking/lesson-09',
        'idosr/networking/lesson-10',
        'idosr/networking/lesson-11',
        'idosr/networking/lesson-05',
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'idosr/windows/intro',
        'idosr/windows/lesson-01',
        'idosr/windows/lesson-02',
        'idosr/windows/lesson-03',
        'idosr/windows/lesson-04',
        'idosr/windows/lesson-05',
        'idosr/windows/lesson-06',
        'idosr/windows/lesson-07',
        'idosr/windows/lesson-08',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'idosr/linux/intro',
        'idosr/linux/lesson-00',
        'idosr/linux/lesson-01',
        'idosr/linux/lesson-02',
        'idosr/linux/lesson-03',
        'idosr/linux/lesson-04',
        'idosr/linux/lesson-05',
        'idosr/linux/lesson-06',
        'idosr/linux/lesson-07',
        'idosr/linux/lesson-08',
        'idosr/linux/lesson-09',
        'idosr/linux/lesson-10',
        'idosr/linux/lesson-11',
        'idosr/linux/lesson-12',
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
        'quizzes/quiz-windows',
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
        'TP/linux/tp-lesson-00',
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'TP/linux/tp-lesson-00',
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
      ],
    },  
  ],

};

module.exports = sidebars;