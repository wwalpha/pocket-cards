//
//  QuestionManager.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
import Foundation

class QuestionManager {
    var loadUrl: String = ""
    var subject: String = ""
    var mode = MODE.PRACTICE

    private var current: Question?
    private var index: Int = 0
    private var questions: [Question] = []
    private var answered: [String] = []
    private var isSuspended: Bool = false

    // check answer correct
    func checkAnswer(answer: String) -> Bool {
        guard let c = current?.answer else { return false }

        return c == answer
    }

    // get current answer
    func getAnswer() -> String? {
        current?.answer
    }

    // get all questions
    func loadQuestions() async throws {
        let params = ["subject": subject]

        do {
            let res = try await API.request(loadUrl, method: .post, parameters: params).serializingDecodable(QuestionServices.LoadQuestion.Response.self).value

            // print("==HUB== \(res)", subject, loadUrl)

            addQuestions(questions: res.questions)

        } catch {
            debugPrint(error)

            isSuspended = true
        }
    }

    func onAction(correct: Bool) {
        // play sound
        playSound(correct: correct)

        // 学習モード、かつ回答不正解の場合、スキップする
        if mode == MODE.PRACTICE, correct == false {
            return
        }

        // delete answered question
        removeQuestion(id: current!.id)

        Task {
            // update flag
            try await onUpdate(qid: current?.id, correct: correct)
        }
    }

    func onChoice(choice: String) {
        let result = checkAnswer(answer: choice)

        // play sound
        playSound(correct: result)

        // 学習モードの場合、かつ不正解の場合
        if mode == MODE.PRACTICE, result == false {
            // set flag
            current?.isAnswered = true

            return
        }

        // 学習モードの場合、かつ正解の場合
        if mode == MODE.PRACTICE, result == true {
            // 訂正の場合
            if current?.isAnswered == true {
                // set flag
                current?.isAnswered = false

                return
            }
        }

        // 学習モード以外の場合
        // delete answered question
        removeQuestion(id: current!.id)

        Task {
            // update question state
            try await onUpdate(qid: current?.id, correct: result)
        }
    }

    private func playSound(correct: Bool) {
        // 正解の場合
        if correct {
            // play sound
            Audio.playCorrect()
        } else {
            // play sound
            Audio.playInCorrect()
        }
    }

    func next() async -> Question? {
        if isSuspended {
            return nil
        }

        do {
            if questions.count <= 0 {
                try await loadQuestions()
            }

            if isSuspended {
                return nil
            }

        } catch {
            return nil
        }

        if mode == MODE.PRACTICE {
            index = (index + 1) % questions.count
        }

        if questions.count > index, index > 0 {
            // get next question
            current = questions[index]
        } else if questions.count != 0 {
            // some errors reset index
            index = 0
            // show next question
            current = questions[index]
        } else {
            current = nil
        }

        // show next question
        return current
    }

    func onUpdate(correct: Bool) async throws {
        try await onUpdate(qid: current?.id, correct: correct)
    }

    func clear() {
        current = nil
        index = -1
        questions = []
        answered = []
    }

    private func addQuestions(questions: [Question]) {
        for q in questions {
            // current question
            if current?.id == q.id {
                continue
            }

            // unanswer question
            if self.questions.contains(where: { $0.id == q.id }) {
                continue
            }

            // answered question
            // debugPrint(q.id, answered, answered.contains(q.id))
            if answered.contains(q.id) {
                continue
            }

            // shuffle choices
            let newQuestion = shuffle(q: q)

            // add new question
            self.questions.append(newQuestion)
        }

        // check question count
        if self.questions.count == 0 {
            isSuspended = true
        }
    }

    private func shuffle(q: Question) -> Question {
        if subject != SUBJECT.LANGUAGE || q.choices == nil {
            debugPrint(q)
            return q
        }

        // create new array for shuffle
        guard let choices = q.choices else { return q }
        // current choices
        var array = Array(1 ... choices.count)

        var newQuestion = q
        var newChoices: [String] = []
        var newAnswer = ""

        while array.count > 0 {
            array = array.shuffled()
            let index = array.popLast() ?? -1

            if index == -1 {
                break
            }

            newChoices.append(choices[index - 1])

            if String(index) == q.answer {
                newAnswer = String(newChoices.count)
            }
        }

        newQuestion.choices = newChoices
        newQuestion.answer = newAnswer

//        print("==HUB== \(newQuestion.choices) \(q.choices)", newQuestion.answer, q.answer)

        return newQuestion
    }

    // update question answer
    private func onUpdate(qid: String?, correct: Bool) async throws {
        guard let id = qid else { return }

        let params = ["correct": Correct.convert(value: correct), "qid": id]

        if mode == MODE.PRACTICE || mode == MODE.EXAM {
            // update answer
            _ = await API.request(URLs.STUDY_DAILY_ANSWER, method: .post, parameters: params).serializingString().response
        }

        if mode == MODE.WEEKLY {
            // update answer
            _ = await API.request(URLs.STUDY_WEEKLY_ANSWER(qid: id), method: .post, parameters: params).serializingString().response
        }
    }

    // delete answered question
    private func removeQuestion(id: String) {
        // remove updated question
        questions.removeAll(where: { $0.id == id })
        // record answered questions
        answered.append(id)
    }
}
