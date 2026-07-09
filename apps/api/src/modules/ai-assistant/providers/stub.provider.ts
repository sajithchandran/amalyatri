import { Injectable } from '@nestjs/common';
import { AiCompletion, AiMessage, AiProvider, SAFETY_DISCLAIMER } from '../ai.provider';

/**
 * Deterministic offline provider used in dev/demo/CI and whenever an API key
 * is missing. It selects from a curated library of wellness responses based
 * on simple keyword matching so the assistant *feels* useful and never goes
 * blank — while always carrying the medical disclaimer.
 */
@Injectable()
export class StubProvider implements AiProvider {
  readonly id = 'stub' as const;

  async complete({ messages }: { system: string; messages: AiMessage[] }): Promise<AiCompletion> {
    const last = messages[messages.length - 1]?.content.toLowerCase() ?? '';
    const reply = pickReply(last);
    return {
      content: `${reply}\n\n${SAFETY_DISCLAIMER}`,
      model: 'amalyatri-stub-v1',
      tokensIn: estimateTokens(messages),
      tokensOut: estimateTokens([{ role: 'assistant', content: reply }]),
      meta: { provider: 'stub', matched: !!last },
    };
  }
}

function pickReply(prompt: string): string {
  if (!prompt) return DEFAULT_GREETING;

  if (/(yoga|morning|stretch|mobility)/.test(prompt)) {
    return "Try a 20-minute gentle Hatha flow: 5 rounds of slow cat–cow, 5 sun salutations with soft knees, and 4 rounds of 4-7-8 breath. Keep it quiet. If anything hurts, stop.";
  }
  if (/(sleep|insomnia|can't sleep)/.test(prompt)) {
    return "Anchor the wind-down: lights dim 90 minutes before bed, warm shower, no screens for 30 minutes, and a 4-7-8 breath sequence (8 cycles). If racing thoughts arrive, jot them on paper for 2 minutes, then return.";
  }
  if (/(breath|breathing|pranayama)/.test(prompt)) {
    return "Try Nadi Shodhana: inhale left 4, retain 4, exhale right 4, repeat for 6 minutes. Keep the breath smooth and slightly slower than your resting rhythm.";
  }
  if (/(meditat|mindful|anxious|stress)/.test(prompt)) {
    return "Sit comfortably for 10 minutes. Eyes soft, breath natural. Each time the mind wanders, gently label ('thinking') and return to the breath. The practice is the returning.";
  }
  if (/(recipe|cook|kitchen|food|meal|diet)/.test(prompt)) {
    return "A simple reset meal: warm kitchari (yellow mung + basmati rice + ginger + cumin), cooked with ghee. Eat at the same time daily for a week and notice digestion.";
  }
  if (/(panchakarma|detox|cleanse)/.test(prompt)) {
    return "Panchakarma is best planned with your Amal Tamara doctor. Outside a retreat, the gentle daily version is: warm cooked food, early dinner, daily oil massage before bathing (abhyanga), and a regular sleep window.";
  }
  if (/(weight|lose weight|kg|kg)/.test(prompt)) {
    return "Sustainable change is gentle, not punishing: daily 25-minute movement, 12-hour overnight fasting window, two cooked meals, zero sugary drinks, and 7+ hours of sleep. Track weekly, not daily.";
  }
  if (/(pain|back|neck|knee|joint)/.test(prompt)) {
    return "Listen to the body before any stretch. Try 10 minutes of slow cat–cow and child's pose. If pain persists beyond 48 hours or radiates, please consult your Amal Tamara doctor.";
  }
  return "I'd love to help — could you tell me a bit more about what you're feeling today? (sleep, energy, digestion, mood, movement, food).";
}

const DEFAULT_GREETING = "Namaste. I'm here to walk alongside your daily wellness. Tell me how today feels in your body.";

function estimateTokens(messages: AiMessage[]): number {
  const chars = messages.reduce((s, m) => s + m.content.length, 0);
  return Math.ceil(chars / 4);
}
