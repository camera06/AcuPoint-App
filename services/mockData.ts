
import { ChatSession, Artifact } from '../types';

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: '1',
    title: 'Frontal Headache Protocol',
    date: new Date().toISOString(),
    preview: 'Treatment for forehead pain...',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'I have a severe headache in my forehead area.',
        timestamp: Date.now() - 5000
      },
      {
        id: 'm2',
        role: 'assistant',
        content: `<div class="section-title">Forehead Correspondence</div>
        <p>In Sujok, the forehead area is mapped to the upper pad of the thumb.</p>
        <div class="numbered-step">
          <span class="step-number">1</span>
          <span><strong>Locate:</strong> Find the most sensitive spot on the top center of your thumb pad.</span>
        </div>
        <div class="numbered-step">
          <span class="step-number">2</span>
          <span><strong>Pressure:</strong> Apply firm pressure for 1-2 minutes or until the sensitivity decreases.</span>
        </div>
        <div class="warning-box">
          <strong>Note:</strong> Persistent headaches should be evaluated by a healthcare professional.
        </div>`,
        timestamp: Date.now()
      }
    ]
  },
  {
    id: '2',
    title: 'Lumbar Support Strategy',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    preview: 'Lower back pain points on the hand...',
    messages: []
  }
];

export const MOCK_ARTIFACTS: Record<string, Artifact> = {
  'protocol-spine': {
    id: 'protocol-spine',
    title: 'Lumbar Spine Correspondence',
    type: 'protocol',
    content: `## Sujok Lumbar Protocol

1. **System**: Standard Correspondence System.
2. **Location**: Back of the hand, between the 3rd and 4th metacarpal bones.
3. **Stimulation**: Use a diagnostic probe to find tender points along the bone.
4. **Seed Therapy**: Apply mung beans or apple seeds to the tender area.

**Duration**: 8-12 hours for chronic issues.`
  }
};

export const generateResponse = (input: string): { text: string; thinking: string; artifactId?: string } => {
  const lower = input.toLowerCase();
  
  if (lower.includes('back') || lower.includes('spine')) {
    return {
      thinking: "Analyzing spinal correspondence systems. Mapping lumbar vertebrae to the dorsal aspect of the hand. Selecting insect system for detailed segment work.",
      text: `<div class="section-title">
  Spinal Correspondence
</div>
<div class="numbered-step">
  <span class="step-number">1</span>
  <span><strong>Dorsal System:</strong> Your entire spine is mapped along the back of your hand. The lower back (lumbar) corresponds to the base of the middle finger metacarpal.</span>
</div>
<div class="numbered-step">
  <span class="step-number">2</span>
  <span><strong>Application:</strong> Find the painful points and massage them deeply. You can use a Sujok ring for general spinal stimulation.</span>
</div>
<div class="warning-box">
  <b>Caution</b>
  <p>If you experience numbness or radiating pain down the legs, please consult a specialist immediately.</p>
</div>`,
      artifactId: 'protocol-spine'
    };
  }
  
  if (lower.includes('stress') || lower.includes('anxiety')) {
    return {
      thinking: "Evaluating emotional balancing protocols. Identifying endocrine system correspondence. Selecting Solar Plexus and Heart chakra points.",
      text: `<div class="section-title">Calming Protocols</div>
      <p>Sujok is highly effective for immediate stress reduction through endocrine balancing.</p>
      <div class="numbered-step">
        <span class="step-number">1</span>
        <span><strong>Solar Plexus:</strong> Massage the center of your palm in a clockwise motion. This regulates the autonomic nervous system.</span>
      </div>
      <div class="numbered-step">
        <span class="step-number">2</span>
        <span><strong>Chest Zone:</strong> Stimulate the base of the thumb (thenar eminence) to calm heart rate and breathing.</span>
      </div>`
    };
  }
  
  return {
    thinking: "Consulting comprehensive Sujok atlas. Analyzing holographic correspondence. Synthesizing wellness recommendation.",
    text: "Machine learning training in progress."
  };
};
