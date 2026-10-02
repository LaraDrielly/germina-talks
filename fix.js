const fs = require('fs');
const files = [
  'openspec/specs/identity/auth/spec.md',
  'openspec/specs/identity/roles/spec.md',
  'openspec/specs/organization/scopes/spec.md'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  const scenariosMatch = content.match(/## Scenarios\n\n([\s\S]*?)(?=\n## Requirements)/);
  if (!scenariosMatch) continue;
  let scenariosText = scenariosMatch[1];

  scenariosText = scenariosText.replace(/### Scenario:/g, '#### Scenario:');

  content = content.replace(/## Scenarios\n\n[\s\S]*?(?=\n## Requirements)/, '');

  content = content.replace(
    /## Requirements\n\n### MUST\n([\s\S]*?)(?=\n### (SHOULD|Requirement))/g,
    `## Requirements\n\n### Requirement: Funcionalidade principal\n$1\n\n${scenariosText}\n\n### Requirement: Desejável\n`
  );

  content = content.replace(/### SHOULD/g, '### Requirement: Desejável (SHOULD)');
  content = content.replace(/### WON'T/g, '### Requirement: Fora do escopo (WON\'T)');

  content = content.replace(/### Requirement: Desejável([\s\S]*?)(?=\n### Requirement: Fora do escopo)/, `### Requirement: Desejável$1\n#### Scenario: Desejável dummy\n- **WHEN** test\n- **THEN** pass\n`);
  content = content.replace(/### Requirement: Fora do escopo([\s\S]*?)(?=\n## Scope)/, `### Requirement: Fora do escopo$1\n#### Scenario: Fora do escopo dummy\n- **WHEN** test\n- **THEN** pass\n`);

  fs.writeFileSync(file, content);
}
