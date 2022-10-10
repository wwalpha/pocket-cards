//
//  HandwritingInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//
import Amplify
import Combine
import Foundation
import UIKit
import Vision

class HandwritingInteractor {
    var presenter: HandwritingPresenter?
    private var manager: QuestionManager = .init()
    private var isCorrect = false
    private var isAnswered = false

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
    }
}

extension HandwritingInteractor: HandwritingBusinessLogic {
    func initialize() {
        Task {
            guard let question = await manager.next() else { return }

            presenter?.showNext(q: question)
        }
    }

    func destroy() {
        manager.clear()
    }

    func vision(image: UIImage) {
        // orientation
        guard let orientation = CGImagePropertyOrientation(rawValue: UInt32(image.imageOrientation.rawValue)) else { return }
        // ci image
        guard let ciImage = CIImage(image: image) else { return }

        // Create a new image-request handler.
        let handler = VNImageRequestHandler(ciImage: ciImage, orientation: orientation)
        // Create a new request to recognize text.
        let request = VNRecognizeTextRequest { request, _ in
            guard let observations = request.results as? [VNRecognizedTextObservation] else {
                print("The observations are of an unexpected type.")
                return
            }

            // 解析結果の文字列を連結する
            let maximumCandidates = 1
            var recognizedText = ""

            for observation in observations {
                guard let candidate = observation.topCandidates(maximumCandidates).first else { continue }
                recognizedText += candidate.string
            }

            print(1234, recognizedText)
        }
        //　language
        request.recognitionLanguages = ["ja-JP"]

        do {
            // Perform the text-recognition request.
            try handler.perform([request])
        } catch {
            print("Unable to perform the requests: \(error).")
        }
    }

    func confirmAnswer(image: UIImage) {
        presenter?.showLoading()

        // vision(image: image)
        // convert image to jpeg
        guard let jpegImage = image.jpegData(compressionQuality: 1) else { return }
        // create file uuid
        let imageKey = UUID().uuidString + ".jpeg"

        // upload data to s3
        Amplify.Storage.uploadData(key: imageKey, data: jpegImage) {
            result in
            switch result {
            case let .success(uploadedData):
                print(uploadedData)

                Task {
                    do {
                        // check answer
                        try await self.checkAnswer(imageKey: imageKey)

                        // hide loading screen
                        self.presenter?.hideLoading()

                        // 回答済の場合、かつ再確認は正解の場合
                        if self.isAnswered, self.isCorrect {
                            try await self.updateAnswer(correct: false)
                        } else {
                            // update answer status
                            try await self.updateAnswer(correct: self.isCorrect)
                        }

                    } catch let err {
                        debugPrint(err)
                    }
                }

            case let .failure(error):
                print(error)
            }
        }
    }

    private func updateAnswer(correct: Bool) async throws {
        // 正解の場合、次の質問の表示
        if isCorrect {
            Audio.playCorrect()
            // 回答結果のアップデート
            try await manager.onUpdate(correct: correct)
            // get next question
            guard let question = await manager.next() else { return }
            // show question
            presenter?.showNext(q: question)
            // answered
            isAnswered = false
        } else {
            Audio.playInCorrect()
            // 不正解の場合、エラー表示
            presenter?.showError()
            // answered
            isAnswered = true
        }
    }

    private func checkAnswer(imageKey: String) async throws {
        let parameters = ["key": imageKey]

        // call api: image to text
        let res = try await API.request(URLs.VISION_HANDWRITING, method: .post, parameters: parameters)
            .validate()
            .serializingDecodable(HandwritingServices.Handwriting.Response.self)
            .value

        var correct = false

        debugPrint(res.results)

        // check answer
        res.results.forEach { item in
            if self.manager.checkAnswer(answer: item) {
                correct = true
            }
        }

        isCorrect = correct
    }
}
