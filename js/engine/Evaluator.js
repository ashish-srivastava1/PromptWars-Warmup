/**
 * Evaluator — Selects quiz questions, grades answers, and generates feedback.
 */
export class Evaluator {
  /**
   * Select a question from a concept's quiz pool matching the target difficulty.
   * Avoids questions already answered in this session when possible.
   * @param {object} concept - Concept with quiz array
   * @param {number} targetDifficulty - Desired difficulty (1-4)
   * @param {number[]} answeredIndices - Indices already answered
   * @returns {{ question: object, index: number } | null}
   */
  selectQuestion(concept, targetDifficulty, answeredIndices = []) {
    const quiz = concept.quiz || [];
    if (quiz.length === 0) return null;

    // Prefer unanswered questions at the target difficulty
    const candidates = quiz
      .map((q, i) => ({ question: q, index: i }))
      .filter(({ index }) => !answeredIndices.includes(index));

    if (candidates.length === 0) {
      // All answered — allow repeats, pick closest difficulty
      const sorted = quiz
        .map((q, i) => ({ question: q, index: i, dist: Math.abs(q.difficulty - targetDifficulty) }))
        .sort((a, b) => a.dist - b.dist);
      return sorted[0];
    }

    // Find closest difficulty match among unanswered
    candidates.sort((a, b) =>
      Math.abs(a.question.difficulty - targetDifficulty) - Math.abs(b.question.difficulty - targetDifficulty)
    );
    return candidates[0];
  }

  /**
   * Grade an answer.
   * @param {object} question - Question object with `correct` index
   * @param {number} selectedIndex - User's selected option index
   * @returns {{ correct: boolean, explanation: string }}
   */
  gradeAnswer(question, selectedIndex) {
    return {
      correct: selectedIndex === question.correct,
      correctAnswer: question.options[question.correct],
      selectedAnswer: question.options[selectedIndex],
      explanation: question.explanation || ''
    };
  }

  /**
   * Generate human-friendly feedback after grading.
   */
  generateFeedback(gradeResult, conceptTitle) {
    if (gradeResult.correct) {
      const messages = [
        `Excellent! You've got a solid grasp on ${conceptTitle}.`,
        `Correct! Great understanding of ${conceptTitle}.`,
        `Nailed it! Your knowledge of ${conceptTitle} is solid.`,
        `Right on! ${conceptTitle} is clicking for you.`
      ];
      return {
        type: 'success',
        title: '✅ Correct!',
        message: messages[Math.floor(Math.random() * messages.length)],
        detail: gradeResult.explanation
      };
    } else {
      return {
        type: 'error',
        title: '❌ Not quite',
        message: `The correct answer is: **${gradeResult.correctAnswer}**`,
        detail: gradeResult.explanation
      };
    }
  }

  /**
   * Calculate overall mastery score for a set of concepts.
   * Returns 0-100.
   */
  calculateOverallMastery(conceptMasteryMap, conceptIds) {
    if (conceptIds.length === 0) return 0;
    const total = conceptIds.reduce((sum, id) => {
      const m = conceptMasteryMap[id];
      return sum + (m ? (m.level / 4) * 100 : 0);
    }, 0);
    return Math.round(total / conceptIds.length);
  }
}

export const evaluator = new Evaluator();
