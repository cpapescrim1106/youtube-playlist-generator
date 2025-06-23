# Programming Planning Guidelines

This document outlines a systematic approach to planning programming tasks before implementation, ensuring thorough preparation and efficient execution.

## 🎯 Planning Principles

### 1. Optimize for AI Context Windows (HIGHEST PRIORITY)
- **Chunk all work into small, independent steps** that fit within AI memory limits
- Each step should be completable in a single AI session
- Plan frequent checkpoints to save progress
- Avoid loading multiple large files simultaneously
- Structure code changes to minimize context needed

### 2. Understand Before You Code
- Read and comprehend requirements fully
- Identify all stakeholders and dependencies
- Clarify ambiguities before starting

### 3. Break Down Complex Tasks
- Decompose large features into smaller, testable units
- Create logical groupings of related functionality
- Define clear boundaries between components
- **Each unit should be small enough for AI to handle in one session**

### 4. Consider the Full Stack
- Frontend implications
- Backend requirements
- Database changes
- Infrastructure needs
- Security considerations

## 📋 The Planning Process

**IMPORTANT**: Check off each item (□ → ✓) as you complete it to track progress and ensure nothing is missed.

### Step 1: Requirements Analysis
```
□ Read the full requirement/ticket/PRD
□ Identify core functionality needed
□ List all user interactions
□ Note technical constraints
□ Identify dependencies on other systems
□ List questions that need clarification
```
✓ Check off each item as completed

### Step 2: Technical Discovery
```
□ Explore existing codebase structure
□ Identify similar patterns already implemented
□ Find reusable components/utilities
□ Check for existing libraries/packages
□ Review relevant documentation
□ Identify potential technical challenges
```
✓ Check off each item as completed

### Step 3: Solution Design
```
□ Choose appropriate architecture pattern
□ Design data models/structures
□ Plan API endpoints (if applicable)
□ Sketch UI components (if applicable)
□ Define interfaces between components
□ Consider error handling strategies
□ Plan for edge cases
```

### Step 4: Task Breakdown
```
□ Create ordered list of implementation tasks
□ CRITICAL: Ensure each task is small enough for one AI session
□ Plan checkpoint commits after each 2-3 tasks
□ Estimate time for each task
□ Identify dependencies between tasks
□ Define testable completion criteria
□ Note which tasks can be parallelized
□ Mark natural break points for context resets
```

### Step 5: Risk Assessment
```
□ Identify technical risks
□ Consider performance implications
□ Review security concerns
□ Plan mitigation strategies
□ Define fallback approaches
```

## 🗂️ Planning Templates

### Feature Planning Template
```markdown
## Feature: [Feature Name]

### Overview
- **Purpose**: [Why this feature exists]
- **Users**: [Who will use this]
- **Success Criteria**: [How we measure success]

### Technical Approach
- **Architecture**: [Pattern/approach chosen]
- **Key Components**:
  1. [Component 1]: [Purpose]
  2. [Component 2]: [Purpose]
  3. [Component 3]: [Purpose]

### Data Requirements
- **Models**: [List data models needed]
- **Storage**: [Database/storage approach]
- **APIs**: [External APIs needed]

### Implementation Tasks (AI-Optimized)
**Track Progress**: Check off tasks as completed ([ ] → [x])

Session 1:
1. [ ] [Task 1 - Small, focused change]
2. [ ] [Task 2 - Related small change]
   - CHECKPOINT: Commit progress

Session 2:
3. [ ] [Task 3 - Next independent piece]
4. [ ] [Task 4 - Related change]
   - CHECKPOINT: Test and commit

Session 3:
5. [ ] [Task 5 - New component/file]
   - CHECKPOINT: Full test cycle
   - [ ] Clean up any temporary test files

### Testing Strategy
- **Unit Tests**: [What to test]
- **Integration Tests**: [Key flows]
- **Edge Cases**: [Special scenarios]
- **Cleanup**: Delete any temporary test files after verification

### Risks & Mitigations
- **Risk 1**: [Description] → [Mitigation]
- **Risk 2**: [Description] → [Mitigation]
```

### Bug Fix Planning Template
```markdown
## Bug: [Bug Description]

### Investigation
- **Symptoms**: [What users experience]
- **Root Cause**: [Technical cause]
- **Affected Areas**: [Code/features impacted]

### Fix Approach
- **Solution**: [How to fix]
- **Changes Required**:
  1. [File/Component]: [Change needed]
  2. [File/Component]: [Change needed]

### Testing
- **Reproduction Steps**: [How to verify bug]
- **Validation**: [How to confirm fix]
- **Regression Tests**: [What else to check]
```

### Refactoring Planning Template
```markdown
## Refactoring: [Area/Component]

### Motivation
- **Current Issues**: [Problems with existing code]
- **Benefits**: [Why refactor now]

### Scope
- **Included**: [What will be refactored]
- **Excluded**: [What stays the same]
- **Dependencies**: [What else might be affected]

### Approach
- **Pattern**: [New pattern/structure]
- **Migration Strategy**: [How to transition]
- **Backwards Compatibility**: [What to maintain]

### Steps
1. [ ] [Preparation step]
2. [ ] [Refactoring step]
3. [ ] [Testing step]
4. [ ] [Migration step]
```

## 🔍 Planning Checklist

### AI Context Window Checklist:
- [ ] Is each task small enough to complete in one AI session?
- [ ] Have I planned checkpoints every 2-3 tasks?
- [ ] Can the AI work on this without loading too many files?
- [ ] Are tasks independent enough to work on separately?
- [ ] Have I avoided tasks that require understanding the entire codebase?

### Before Starting Any Task:
- [ ] Do I understand what success looks like?
- [ ] Have I identified all dependencies?
- [ ] Do I know the existing code patterns to follow?
- [ ] Have I considered error cases?
- [ ] Is my approach testable?
- [ ] Have I estimated the effort required?

### For New Features:
- [ ] User flow documented?
- [ ] Data model designed?
- [ ] API contracts defined?
- [ ] UI mockups reviewed?
- [ ] Performance requirements clear?
- [ ] Security requirements addressed?

### For Bug Fixes:
- [ ] Root cause identified?
- [ ] Reproduction steps documented?
- [ ] Fix approach validated?
- [ ] Regression impact assessed?
- [ ] Test cases defined?

### For Refactoring:
- [ ] Clear improvement goals?
- [ ] Backwards compatibility plan?
- [ ] Migration strategy defined?
- [ ] Testing approach comprehensive?
- [ ] Rollback plan available?

## 📊 Estimation Guidelines

### Task Size Reference (AI-Optimized):
- **Trivial** (< 30 min): Config changes, simple UI tweaks - Perfect for AI
- **Small** (30 min - 1 hr): Single component changes - Ideal AI session size
- **Medium** (1-2 hr): Multi-component features - Split into 2-3 AI sessions
- **Large** (2-4 hr): Complex features - Must be broken down into smaller tasks
- **XL** (> 4 hr): Too large for AI - Break down before starting

### AI Session Guidelines:
- **Optimal session**: 30-45 minutes of focused work
- **Max session**: 1 hour before context reset needed
- **Files per session**: 3-5 files maximum
- **Changes per session**: 1-2 features or bug fixes

### Estimation Factors:
- **Complexity**: Algorithm difficulty, business logic
- **Integration**: Number of systems involved
- **Testing**: Test coverage required
- **Documentation**: Docs to write/update
- **Review**: Code review cycles expected

### Buffer Recommendations:
- Add 20% for unfamiliar code areas
- Add 30% for external dependencies
- Add 40% for concurrent team changes
- Add 50% for critical path items

## 🚀 Quick Planning for Common Scenarios

### Adding a New API Endpoint
1. Define request/response schema
2. Check authentication requirements
3. Plan validation rules
4. Consider rate limiting
5. Design error responses
6. Plan integration tests

### Creating a New UI Component
1. Review design mockups
2. Identify reusable elements
3. Plan component props/API
4. Consider responsive behavior
5. Plan accessibility features
6. Define test scenarios

### Database Schema Changes
1. Analyze current schema
2. Plan migration strategy
3. Consider backwards compatibility
4. Plan data migration
5. Define rollback procedure
6. Plan performance testing

### Third-party Integration
1. Review API documentation
2. Plan authentication approach
3. Design error handling
4. Plan retry strategies
5. Consider rate limits
6. Design fallback behavior

## 💡 Best Practices

### Communication
- Document assumptions clearly
- Ask questions early
- Share planning with team
- Update plans as you learn

### Flexibility
- Plans are guides, not contracts
- Adjust as you discover issues
- Track deviations for learning
- Communicate changes promptly

### Learning
- Review plan vs actual after completion
- Document lessons learned
- Update templates based on experience
- Share insights with team

## 🎓 Planning Anti-patterns to Avoid

### Over-planning
- Spending more time planning than doing
- Creating unnecessarily detailed plans
- Planning for unlikely scenarios
- Paralysis by analysis

### Under-planning
- Jumping straight to code
- Ignoring dependencies
- Missing edge cases
- No consideration for testing

### Common Mistakes
- Not validating assumptions
- Ignoring existing patterns
- Planning in isolation
- Not considering maintenance
- Forgetting about deployment

## 📚 Additional Resources

### When to Use Each Planning Level:
- **Light Planning**: Familiar tasks, small changes
- **Standard Planning**: New features, moderate complexity
- **Deep Planning**: Architecture changes, critical features
- **Formal Planning**: New systems, major refactors

### Tools for Planning:
- Diagrams: Architecture, flow charts, sequence diagrams
- Prototypes: Proof of concepts, UI mockups
- Spikes: Technical investigations
- Documentation: ADRs, design docs
- Collaboration: Pair planning, team reviews

### Testing Considerations

**IMPORTANT**: Clean up any test files created during testing once they're no longer needed.

#### Standard Testing with Puppeteer MCP
For UI and end-to-end testing, use Puppeteer MCP as the standard approach:
- Navigate to pages and take screenshots
- Click elements and fill forms
- Execute JavaScript in browser context
- Verify user flows work correctly

Example workflow:
```
1. Navigate to your app
2. Screenshot the initial state
3. Click buttons/fill forms
4. Verify expected results
5. Screenshot final state
```

#### Isolated Environment Testing
When planning tests, especially for AI-generated code, consider using Docker for isolated testing environments if you need to:
- Test without affecting your local setup
- Verify code works in clean environments
- Test across different versions/platforms
- Automatic cleanup with `--rm` flag

Example: `docker run --rm -v $(pwd):/app node:18 npm test`

Remember: Good planning is an investment that pays dividends in faster implementation, fewer bugs, and better code quality. The goal is to think through problems before they become expensive to fix.