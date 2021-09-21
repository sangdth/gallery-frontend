import { NodePlopAPI } from 'plop';

const generators = (plop: NodePlopAPI): void => {
  plop.setGenerator('component', {
    description: 'React component generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'components/{{name}}/index.ts',
        templateFile: 'templates/component/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'components/{{name}}/{{name}}.tsx',
        templateFile: 'templates/component/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'components/{{name}}/{{name}}.spec.tsx',
        templateFile: 'templates/component/component.spec.tsx.hbs',
      },
      {
        type: 'modify',
        path: 'components/index.ts',
        pattern: /\/\/ PLOP WILL AUTO APPEND NEW COMPONENT HERE\n/gi,
        templateFile: 'templates/component/modify.hbs',
      },
    ],
  });

  plop.setGenerator('hook', {
    description: 'Custom hook generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Hook name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'lib/hooks/{{name}}.ts',
        templateFile: 'templates/hook/hook.ts.hbs',
      },
      // {
      //   type: 'add',
      //   path: 'lib/hooks/{{name}}.spec.ts',
      //   templateFile: 'templates/hook/hook.spec.ts.hbs',
      // },
      {
        type: 'modify',
        path: 'lib/hooks/index.ts',
        pattern: /\/\/ PLOP WILL AUTO APPEND NEW COMPONENT HERE\n/gi,
        templateFile: 'templates/hook/modify.hbs',
      },
    ],
  });
};

export default generators;
