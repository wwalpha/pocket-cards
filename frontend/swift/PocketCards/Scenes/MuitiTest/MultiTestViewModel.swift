//
//  MultiTestViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/09/17.
//
//

import SwiftUI

class MultiTestViewModel: ObservableObject {
    @Published var isConnected = false
    @Published var isConnecting = false
    @Published var isShowQuestion = false
    @Published var isShowAnswer = false
    @Published var readOnly = true

    var question: Question?
}
