//
//  MultiTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/09/17.
//
//
import Foundation

class MultiTestInteractor {
    var presenter: MultiTestPresentationLogic?
    var task: WebSocketTaskConnection?
    var session = URLSession(configuration: .default)
    var decoder = JSONDecoder()
    var q: Question?
    var isConnected = false
}

extension MultiTestInteractor: MultiTestBusinessLogic, WebSocketConnectionDelegate {
    func updateAnswer(correct: Bool) {
        Task {
            let params = ["correct": Correct.convert(value: correct), "qid": q!.id]

            // update answer
            _ = await API.request(URLs.STUDY_DAILY_ANSWER, method: .post, parameters: params).serializingString().response
        }
    }

    func connect() {
        // show connecting
        presenter?.onConnecting()

        debugPrint("onConnecting")

        let urlString = URLs.WSS_URL(token: TokenManager.shared.getIdToken())
        guard let url = URL(string: urlString) else { return }

        task = WebSocketTaskConnection(url: url)
        task?.delegate = self
        task?.connect()
    }

    func onConnected(connection _: WebSocketConnection) {
        presenter?.onConnected()
        isConnected = true
    }

    func onDisconnected(connection _: WebSocketConnection, error _: Error?) {
        presenter?.onDisconnected()

        if isConnected {
            connect()
        }
    }

    func onError(connection: WebSocketConnection, error: Error) {
        debugPrint("connection", connection)
        debugPrint("error", error)
    }

    func onMessage(connection _: WebSocketConnection, text: String) {
        debugPrint("on message texts...", text)

        guard let data = text.data(using: .utf8) else { return }
        guard let cmd = try? decoder.decode(Command.self, from: data) else { return }

        switch cmd.command {
        case "SHOW_CORRECT":
            // play sound
            Audio.playCorrect()

            updateAnswer(correct: true)

            // show question
            getQuestion(text: cmd.payload!)

        case "SHOW_ANSWER":
            presenter?.showAnswer()

            updateAnswer(correct: false)

            // play sound
            Audio.playInCorrect()

        case "SHOW_NEXT":
            // show question
            getQuestion(text: cmd.payload!)

        default:
            break
        }
    }

    func onMessage(connection _: WebSocketConnection, data _: Data) {
        debugPrint("on message datas...")
    }

    func disconnect() {
        debugPrint("disconnect")

        // disconnect
        task?.disconnect()

        presenter?.onDisconnected()

        isConnected = false
    }

    func getQuestion(text: String) {
        guard let data = text.data(using: .utf8) else { return }
        guard let value = try? decoder.decode(CommandServices.QuestionQuery.Body.self, from: data) else { return }

        API.request(URLs.QUESTION_DESCRIBE(gid: value.gid, qid: value.qid), method: .get)
            .responseDecodable(of: CommandServices.QuestionQuery.Response.self) { response in
                guard let res = response.value else { return }

                print("==HUB== \(res)")

                // save template
                self.q = res.question

                // show question
                self.presenter?.showNext(question: res.question)
            }
    }

    func onAction(correct _: Bool) {}
    func onChoice(choice _: String) {}
}
