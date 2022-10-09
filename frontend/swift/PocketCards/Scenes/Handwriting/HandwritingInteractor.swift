//
//  HandwritingInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//

import Foundation
import UIKit

class HandwritingInteractor {
    var presenter: HandwritingPresenter?
    private var manager: QuestionManager = .init()

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
    }
}

extension HandwritingInteractor: HandwritingBusinessLogic {
    func confirmAnswer(image _: UIImage) {}

    func initialize() {
        Task {
            guard let question = await manager.next() else { return }

            presenter?.showNext(q: question)
        }
    }

//    func confirmAnswer(image _: UIImage) {
//        // upload image to s3
//
//        // check result
//
//        let result = ""
//
//        if result == "" {
//
//        } else {}
//    }
}
