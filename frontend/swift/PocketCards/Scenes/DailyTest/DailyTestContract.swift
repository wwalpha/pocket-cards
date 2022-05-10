//
//  DailyTestContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//
import Foundation

protocol DailyTestDisplayLogic {
    func showNext(model: DailyTestViewModel)
}

protocol DailyTestBusinessLogic: StudyBusinessLogic {}

protocol DailyTestPresentationLogic: StudyPresentationLogic {}
