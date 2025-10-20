// src/utils/modelGenerator.js
import { toSnakeCase, pluralize, processRelationships, getBridgeTableName } from './routeGenerator.js';

export function generateModels(entities, relationships, projectName) {
  const entityRelationships = processRelationships(entities, relationships);
  let code = `# Generated Models for ${projectName}\n\n`;
  code += `from .extensions import db\n`;
  code += `from datetime import datetime, timezone\n\n`;
  
  // Generate bridge tables
  const bridgeTables = new Set();
  Object.entries(entityRelationships).forEach(([entityName, rels]) => {
    rels.filter(r => r.type === 'many-to-many').forEach(rel => {
      const bridgeName = getBridgeTableName(entityName, rel.target);
      if (!bridgeTables.has(bridgeName)) {
        bridgeTables.add(bridgeName);
        const sorted = [entityName, rel.target].sort();
        code += `${bridgeName} = db.Table('${bridgeName}',\n`;
        code += `    db.Column('${toSnakeCase(sorted[0])}_id', db.Integer, db.ForeignKey('${toSnakeCase(pluralize(sorted[0]))}.id'), primary_key=True),\n`;
        code += `    db.Column('${toSnakeCase(sorted[1])}_id', db.Integer, db.ForeignKey('${toSnakeCase(pluralize(sorted[1]))}.id'), primary_key=True)\n`;
        code += `)\n\n`;
      }
    });
  });

  // Generate models
  entities.forEach(entity => {
    if (!entity.name) return;
    const rels = entityRelationships[entity.name] || [];
    
    code += `class ${entity.name}(db.Model):\n`;
    code += `    __tablename__ = '${toSnakeCase(pluralize(entity.name))}'\n\n`;
    code += `    id = db.Column(db.Integer, primary_key=True)\n`;
    
    entity.fields.forEach(field => {
      if (field.name) {
        let dbType;
        switch (field.type) {
          case 'String': dbType = 'db.String(255)'; break;
          case 'Integer': dbType = 'db.Integer'; break;
          case 'Boolean': dbType = 'db.Boolean'; break;
          case 'DateTime': dbType = 'db.DateTime'; break;
          default: dbType = 'db.String(255)';
        }
        let columnArgs = field.name.toLowerCase() === 'name' ? 'nullable=False, unique=True' : 'nullable=True';
        code += `    ${toSnakeCase(field.name)} = db.Column(${dbType}, ${columnArgs})\n`;
      }
    });

    rels.filter(r => r.type === 'many-to-one').forEach(rel => {
      code += `    ${toSnakeCase(rel.target)}_id = db.Column(db.Integer, db.ForeignKey('${toSnakeCase(pluralize(rel.target))}.id'), nullable=False)\n`;
    });
    
    code += `    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))\n`;
    code += `    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))\n\n`;

    if (rels.length > 0) {
      code += `    # Relationships\n`;
      rels.forEach(rel => {
        code += `    ${rel.relationshipName} = db.relationship('${rel.target}', back_populates='${rel.backPopulates}'`;
        if (rel.type === 'one-to-many') code += `, cascade='all, delete-orphan'`;
        if (rel.type === 'many-to-many') {
          const bridgeName = getBridgeTableName(entity.name, rel.target);
          code += `, secondary=${bridgeName}`;
        }
        code += `)\n`;
      });
    }
    
    const hasNameField = entity.fields.some(f => f.name.toLowerCase() === 'name');
    code += `\n    def __repr__(self):\n`;
    code += `        return f'<${entity.name} {self.${hasNameField ? 'name' : 'id'}}>'\n\n\n`;
  });
  
  return code;
}