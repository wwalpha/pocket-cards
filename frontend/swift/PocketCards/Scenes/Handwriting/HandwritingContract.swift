//
//  HandwritingContract.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//

import Foundation
import UIKit

// View logic
protocol HandwritingDisplayLogic {
    func showNext(model: HandwritingViewModel)

    func showError(result: String)

    func showLoading(model: HandwritingViewModel)
}

// Interactor logic
protocol HandwritingBusinessLogic {
    func initialize()

    func confirmAnswer(image: UIImage)

    func next()

    func destroy()
}

// Presenter logic
protocol HandwritingPresentationLogic {
    func showNext(q: Question)

    func showNothing()

    func showError(result: String)

    func showLoading()

    func hideLoading()
}
