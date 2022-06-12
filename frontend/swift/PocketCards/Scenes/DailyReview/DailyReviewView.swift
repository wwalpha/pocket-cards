//
//  DailyReviewView.swift
//  PocketCards
//
//  Created by macmini on 2022/06/12.
//  
//

import SwiftUI


struct DailyReviewView: View {
    var interactor: DailyReviewBusinessLogic?

    @ObservedObject var viewModel = DailyReviewViewModel()

    var body: some View {
        Text("Hello")
    }
}

extension DailyReviewView: DailyReviewDisplayLogic {

}

extension DailyReviewView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyReviewInteractor()
        let presenter = DailyReviewPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct DailyReviewView_Previews: PreviewProvider {
    static var previews: some View {
        DailyReviewView()
    }
}
