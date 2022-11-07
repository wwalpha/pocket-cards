//
//  DailyTestContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//
import Foundation

protocol DailyTestDisplayLogic {
    func showNext(model: DailyTestViewModel)

    func onUpdate(model: DailyTestViewModel)
}

protocol DailyTestBusinessLogic {
    func initialize() async

    func onChoice(choice: String)

    func onAction(correct: Bool)

    func next() async

    func destory()
}

protocol DailyTestPresentationLogic {
    func showNext(q: Question)

    func showNothing()

    func showLoading()

    func showError(index: String)
}
